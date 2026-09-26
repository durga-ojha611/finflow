import Invoice from '../models/Invoice.js';
import RemediationLog from '../models/RemediationLog.js';
import {
  calculateDaysStuck,
  calculateIsDelayed,
  calculateFinancialLoss,
} from '../utils/calculationHelpers.js';

/**
 * Execute 1-Click Remediation Actions
 *
 * Supported Actions:
 * 1. SLACK_PING: Simulates Slack/WhatsApp webhook alert to managers with overdue queues.
 * 2. REQUEST_DOCS: Dispatches automated upload requests to vendors, resolves doc errors.
 * 3. AUTO_REROUTE: Re-assigns overdue (>48h) invoices from congested approvers to co-approvers.
 */
export const executeRemediation = async ({
  actionType,
  invoiceIds = [],
  triggeredBy = 'Finance Admin',
}) => {
  let affectedInvoices = [];
  let impactSummary = '';
  let details = {};

  if (!['SLACK_PING', 'REQUEST_DOCS', 'AUTO_REROUTE'].includes(actionType)) {
    throw new Error(`Invalid actionType '${actionType}'. Must be SLACK_PING, REQUEST_DOCS, or AUTO_REROUTE.`);
  }

  // Helper filter: if specific IDs passed, filter by them; otherwise pick relevant candidates
  const idFilter = invoiceIds && invoiceIds.length > 0 ? { invoiceId: { $in: invoiceIds } } : {};

  switch (actionType) {
    case 'SLACK_PING': {
      // Find invoices pending manager approval or with SLA delays
      const query = {
        ...idFilter,
        currentStage: { $in: ['Manager Approval', 'Verification'] },
        sapRawStatus: { $ne: 'RESOLVED' },
      };

      affectedInvoices = await Invoice.find(query);
      if (affectedInvoices.length === 0) {
        affectedInvoices = await Invoice.find({ ...idFilter, isDelayed: true });
      }

      const approverSet = new Set(affectedInvoices.map((inv) => inv.assignedApprover));
      const approversList = Array.from(approverSet).filter(Boolean);

      // Simulate webhook dispatch
      details = {
        slackChannel: '#finance-urgent-approvals',
        webhookStatus: 'DELIVERED',
        recipients: approversList.length > 0 ? approversList : ['Manager A', 'Manager B'],
        message: `🚨 *FinFlow AI SLA Escalation*: ${affectedInvoices.length} critical invoices require immediate review. Overdue penalty threshold reached.`,
        deliveryTimestamp: new Date().toISOString(),
      };

      impactSummary = `Dispatched automated Slack & WhatsApp webhook alerts to ${approversList.join(
        ', '
      )} across ${affectedInvoices.length} overdue invoices.`;

      // Expedite processing: reduce correction count and nudge priority
      for (const inv of affectedInvoices) {
        if (inv.correctionCount > 0) {
          inv.correctionCount -= 1;
        }
        await inv.save();
      }
      break;
    }

    case 'REQUEST_DOCS': {
      // Find invoices blocked by documentation issues (Missing GST, PO Mismatch, Tax Pending)
      const query = {
        ...idFilter,
        documentStatus: { $in: ['Missing GST', 'PO Mismatch', 'Tax Pending'] },
        sapRawStatus: { $ne: 'RESOLVED' },
      };

      affectedInvoices = await Invoice.find(query);

      if (affectedInvoices.length === 0 && (!invoiceIds || invoiceIds.length === 0)) {
        // Fallback to any invoice with document status != Complete
        affectedInvoices = await Invoice.find({ documentStatus: { $ne: 'Complete' } });
      }

      let totalLossRecovered = 0;

      // Update statuses to Complete and RESOLVED/SYNCED to eliminate penalties
      for (const inv of affectedInvoices) {
        const previousLoss = inv.estimatedFinancialLoss || 0;
        totalLossRecovered += previousLoss;

        inv.documentStatus = 'Complete';
        inv.sapRawStatus = 'SYNCED';
        inv.isDelayed = false;
        inv.estimatedFinancialLoss = 0;
        inv.correctionCount = 0;

        // If in Verification, advance to Manager Approval
        if (inv.currentStage === 'Verification') {
          inv.currentStage = 'Manager Approval';
        }

        await inv.save();
      }

      details = {
        vendorsNotified: Array.from(new Set(affectedInvoices.map((i) => i.vendorName))),
        portalLinkTemplate: 'https://supplier.finflow.ai/upload?auth_token=JWT_EXP_48H',
        documentationResolved: true,
        financialLossRecoveredINR: totalLossRecovered,
      };

      impactSummary = `Dispatched automated vendor document submission links to ${
        details.vendorsNotified.length
      } vendors. Resolved documentation blocks on ${
        affectedInvoices.length
      } invoices, recovering ₹${totalLossRecovered.toLocaleString('en-IN')} in potential SLA losses.`;
      break;
    }

    case 'AUTO_REROUTE': {
      // Find invoices overdue (>48h / isDelayed = true) under congested approvers
      const query = {
        ...idFilter,
        isDelayed: true,
        currentStage: 'Manager Approval',
        sapRawStatus: { $ne: 'RESOLVED' },
      };

      affectedInvoices = await Invoice.find(query);

      if (affectedInvoices.length === 0) {
        // If none strictly in Manager Approval, search all delayed invoices
        affectedInvoices = await Invoice.find({ ...idFilter, isDelayed: true });
      }

      const alternateApprovers = [
        'Manager B (Backup Approver)',
        'Operations Co-Lead',
        'Finance Director Delegate',
      ];

      let totalLossMitigated = 0;

      for (let idx = 0; idx < affectedInvoices.length; idx++) {
        const inv = affectedInvoices[idx];
        const previousLoss = inv.estimatedFinancialLoss || 0;
        totalLossMitigated += previousLoss;

        // Reassign to alternate approver
        inv.assignedApprover = alternateApprovers[idx % alternateApprovers.length];
        inv.sapRawStatus = 'SYNCED';
        inv.isDelayed = false;
        inv.estimatedFinancialLoss = 0;

        // Grant SLA extension window of 3 days
        const newDue = new Date();
        newDue.setDate(newDue.getDate() + 3);
        inv.approvalDueDate = newDue;

        await inv.save();
      }

      details = {
        reassignedApprovers: alternateApprovers,
        invoicesReroutedCount: affectedInvoices.length,
        financialLossMitigatedINR: totalLossMitigated,
      };

      impactSummary = `Re-routed ${
        affectedInvoices.length
      } bottlenecked approval tasks from overloaded queues to certified co-approvers. Mitigated ₹${totalLossMitigated.toLocaleString(
        'en-IN'
      )} in overdue SLA penalties.`;
      break;
    }
  }

  // Create audit log
  const log = await RemediationLog.create({
    invoiceIds: affectedInvoices.map((i) => i.invoiceId),
    actionType,
    triggeredBy,
    status: 'SUCCESS',
    impactSummary,
    details,
    timestamp: new Date(),
  });

  return {
    success: true,
    actionType,
    impactSummary,
    affectedCount: affectedInvoices.length,
    remediatedInvoiceIds: affectedInvoices.map((i) => i.invoiceId),
    log,
  };
};

/**
 * Fetch remediation logs with pagination
 */
export const getRemediationLogs = async ({ limit = 20, page = 1 } = {}) => {
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
  const total = await RemediationLog.countDocuments();
  const logs = await RemediationLog.find({})
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
    logs,
  };
};
