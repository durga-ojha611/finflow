import asyncHandler from 'express-async-handler';
import Invoice from '../models/Invoice.js';
import RemediationLog from '../models/RemediationLog.js';

/**
 * @desc    Get CFO Executive Audit Report summary
 * @route   GET /api/v1/reports/summary
 * @access  Public
 */
export const getExecutiveReportSummary = asyncHandler(async (req, res) => {
  // Aggregate overall metrics
  const totalsAgg = await Invoice.aggregate([
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        delayedCount: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
        totalFinancialLoss: { $sum: '$estimatedFinancialLoss' },
        avgDaysStuck: { $avg: '$daysStuck' },
      },
    },
  ]);

  const totals = totalsAgg[0] || {
    totalInvoices: 0,
    totalAmount: 0,
    delayedCount: 0,
    totalFinancialLoss: 0,
    avgDaysStuck: 0,
  };

  // Department breakdown
  const departmentBreakdown = await Invoice.aggregate([
    {
      $group: {
        _id: '$department',
        totalInvoices: { $sum: 1 },
        totalSpend: { $sum: '$amount' },
        delayedCount: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
        financialLoss: { $sum: '$estimatedFinancialLoss' },
        avgDays: { $avg: '$daysStuck' },
      },
    },
    { $sort: { financialLoss: -1 } },
  ]);

  // Aggregate past remediation logs to compute total mitigated loss
  const remediationLogs = await RemediationLog.find({});
  let totalLossMitigated = 0;
  for (const log of remediationLogs) {
    if (log.details?.financialLossRecoveredINR) {
      totalLossMitigated += log.details.financialLossRecoveredINR;
    }
    if (log.details?.financialLossMitigatedINR) {
      totalLossMitigated += log.details.financialLossMitigatedINR;
    }
  }

  const baselineCycleDays = Math.round((totals.avgDaysStuck || 7.8) * 10) / 10;
  const targetOptimizedCycleDays = 3.8; // Target benchmark with FinFlow automation
  const cycleTimeReductionPercentage =
    baselineCycleDays > targetOptimizedCycleDays
      ? Math.round(
          ((baselineCycleDays - targetOptimizedCycleDays) / baselineCycleDays) * 1000
        ) / 10
      : 0;

  // Projected Annual Savings:
  // Extrapolate monthly avoided discount loss & SLA penalties to annual run rate (x12)
  // + Estimated manual AP team operational labor hours saved
  const monthlyDirectLoss = totals.totalFinancialLoss;
  const projectedAnnualDiscountSavings = Math.round(monthlyDirectLoss * 12);
  const operationalEfficiencyGains = Math.round(totals.totalInvoices * 450 * 12); // ₹450 saved per automated invoice processing
  const projectedAnnualSavings = projectedAnnualDiscountSavings + operationalEfficiencyGains;

  res.status(200).json({
    success: true,
    data: {
      reportTitle: 'CFO Executive Audit & Process Intelligence Report',
      period: 'Trailing 30 Days (Annualized Run-Rate)',
      currency: 'INR',
      summary: {
        projectedAnnualSavingsINR: projectedAnnualSavings,
        cycleTimeReductionPercentage,
        currentAverageCycleDays: baselineCycleDays,
        targetOptimizedCycleDays,
        totalInvoicesAudited: totals.totalInvoices,
        totalSpendAuditedINR: totals.totalAmount,
        activeDelayedInvoices: totals.delayedCount,
        currentAtRiskLossINR: totals.totalFinancialLoss,
        historicalLossMitigatedINR: totalLossMitigated,
        remediationActionRuns: remediationLogs.length,
      },
      departmentEfficiency: departmentBreakdown.map((dept) => ({
        department: dept._id,
        totalInvoices: dept.totalInvoices,
        totalSpendINR: dept.totalSpend,
        delayedInvoices: dept.delayedCount,
        financialLossINR: dept.financialLoss,
        avgCycleDays: Math.round((dept.avgDays || 0) * 10) / 10,
        complianceRate:
          dept.totalInvoices > 0
            ? Math.round(((dept.totalInvoices - dept.delayedCount) / dept.totalInvoices) * 100)
            : 100,
      })),
      strategicRecommendations: [
        'Mandate supplier GST pre-validation on portal before SAP ERP booking',
        'Enforce automated rerouting when manager approval queue exceeds 48-hour SLA limit',
        'Accelerate payment release for Tier-1 suppliers to capture 100% early discount yield',
      ],
      generatedAt: new Date().toISOString(),
    },
  });
});
