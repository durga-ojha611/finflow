import asyncHandler from 'express-async-handler';
import Invoice from '../models/Invoice.js';
import { STAGES_ORDER, STAGE_SLA_TARGETS } from '../utils/calculationHelpers.js';

/**
 * @desc    Get aggregate executive dashboard metrics dynamically
 * @route   GET /api/v1/dashboard/metrics
 * @access  Public
 */
export const getDashboardMetrics = asyncHandler(async (req, res) => {
  // Aggregate core summary
  const summaryAgg = await Invoice.aggregate([
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        delayedInvoices: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
        totalFinancialLoss: { $sum: '$estimatedFinancialLoss' },
      },
    },
  ]);

  const summary = summaryAgg[0] || {
    totalInvoices: 0,
    totalAmount: 0,
    delayedInvoices: 0,
    totalFinancialLoss: 0,
  };

  // Stage-wise breakdown to determine primary bottleneck
  const stageStats = await Invoice.aggregate([
    {
      $group: {
        _id: '$currentStage',
        count: { $sum: 1 },
        delayedCount: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
        avgDaysStuck: { $avg: '$daysStuck' },
        stageLoss: { $sum: '$estimatedFinancialLoss' },
      },
    },
  ]);

  let primaryBottleneckStage = 'Manager Approval';
  let highestImpactScore = -1;

  for (const item of stageStats) {
    const slaTarget = STAGE_SLA_TARGETS[item._id] || 2;
    const excessDays = Math.max(0, (item.avgDaysStuck || 0) - slaTarget);
    const impactScore = excessDays * (item.delayedCount || 0) * 10 + (item.stageLoss || 0);

    if (impactScore > highestImpactScore) {
      highestImpactScore = impactScore;
      primaryBottleneckStage = item._id;
    }
  }

  // Document issues count
  const documentIssues = await Invoice.countDocuments({
    documentStatus: { $ne: 'Complete' },
  });

  const delayedPercentage =
    summary.totalInvoices > 0
      ? Math.round((summary.delayedInvoices / summary.totalInvoices) * 1000) / 10
      : 0;

  res.status(200).json({
    success: true,
    data: {
      totalInvoices: summary.totalInvoices,
      delayedInvoices: summary.delayedInvoices,
      delayedPercentage,
      totalAmount: summary.totalAmount,
      totalFinancialLoss: summary.totalFinancialLoss,
      primaryBottleneckStage,
      documentIssuesCount: documentIssues,
      currency: 'INR',
      lastCalculatedAt: new Date().toISOString(),
    },
  });
});

/**
 * @desc    Get average processing days per stage vs target SLA limit for Chart.js/Recharts
 * @route   GET /api/v1/dashboard/pipeline
 * @access  Public
 */
export const getPipelineMetrics = asyncHandler(async (req, res) => {
  const stageAgg = await Invoice.aggregate([
    {
      $group: {
        _id: '$currentStage',
        totalInvoices: { $sum: 1 },
        delayedCount: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
        avgDaysStuck: { $avg: '$daysStuck' },
        totalLoss: { $sum: '$estimatedFinancialLoss' },
      },
    },
  ]);

  const stageMap = {};
  for (const s of stageAgg) {
    stageMap[s._id] = s;
  }

  // Form pipeline array ordered sequentially
  const pipeline = STAGES_ORDER.map((stageName) => {
    const aggData = stageMap[stageName] || {
      totalInvoices: 0,
      delayedCount: 0,
      avgDaysStuck: 0,
      totalLoss: 0,
    };

    const targetSLA = STAGE_SLA_TARGETS[stageName] || 2;
    const avgDays = Math.round((aggData.avgDaysStuck || 0) * 10) / 10;
    const isExceeded = avgDays > targetSLA;

    let status = 'HEALTHY';
    if (avgDays >= targetSLA * 1.5) {
      status = 'CRITICAL_BOTTLENECK';
    } else if (avgDays > targetSLA) {
      status = 'WARNING';
    }

    return {
      stage: stageName,
      avgDays,
      targetSLA,
      varianceDays: Math.round((avgDays - targetSLA) * 10) / 10,
      delayedCount: aggData.delayedCount,
      totalInvoices: aggData.totalInvoices,
      totalLossINR: aggData.totalLoss,
      status,
    };
  });

  res.status(200).json({
    success: true,
    data: pipeline,
  });
});
