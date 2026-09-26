import Invoice from '../models/Invoice.js';
import {
  calculateDaysStuck,
  calculateIsDelayed,
  calculateFinancialLoss,
} from '../utils/calculationHelpers.js';

/**
 * SAP S/4HANA 2-Way Sync Engine
 * Simulates enterprise OData sync with SAP S/4HANA API_SUPPLIERINVOICE_PROCESS_SRV
 */
export const syncWithSAP = async () => {
  const startTime = Date.now();
  const invoices = await Invoice.find({});
  let updatedCount = 0;
  let slaViolationsDetected = 0;
  const now = new Date();

  for (const inv of invoices) {
    let wasModified = false;

    // Recalculate days stuck
    const newDaysStuck = calculateDaysStuck(inv.receivedDate, inv.completedDate);
    if (inv.daysStuck !== newDaysStuck) {
      inv.daysStuck = newDaysStuck;
      wasModified = true;
    }

    // Check SLA violation
    if (inv.sapRawStatus !== 'RESOLVED' && inv.approvalDueDate && now > inv.approvalDueDate) {
      if (!inv.isDelayed) {
        inv.isDelayed = true;
        wasModified = true;
      }
      slaViolationsDetected++;

      // If synced but overdue, mark PENDING_APPROVAL_SLA
      if (inv.sapRawStatus === 'SYNCED') {
        inv.sapRawStatus = 'PENDING_APPROVAL_SLA';
        wasModified = true;
      }
    } else if (inv.sapRawStatus === 'RESOLVED') {
      if (inv.isDelayed) {
        inv.isDelayed = false;
        wasModified = true;
      }
    }

    // Recalculate financial loss
    const newLoss = calculateFinancialLoss(
      inv.amount,
      inv.isDelayed,
      inv.approvalDueDate,
      inv.completedDate,
      inv.sapRawStatus
    );

    if (inv.estimatedFinancialLoss !== newLoss) {
      inv.estimatedFinancialLoss = newLoss;
      wasModified = true;
    }

    if (wasModified) {
      await inv.save();
      updatedCount++;
    }
  }

  const syncDurationMs = Date.now() - startTime;

  return {
    syncStatus: 'SUCCESS',
    sapEndpoint: 'https://sap-s4hana.corp.internal/sap/opu/odata/sap/API_SUPPLIERINVOICE_PROCESS_SRV',
    timestamp: new Date().toISOString(),
    totalInvoicesExamined: invoices.length,
    invoicesUpdated: updatedCount,
    slaViolationsDetected,
    syncDurationMs,
    protocol: 'OData v4 / HTTPS',
  };
};
