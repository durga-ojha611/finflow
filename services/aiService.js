import Invoice from '../models/Invoice.js';
import { STAGE_SLA_TARGETS } from '../utils/calculationHelpers.js';

/**
 * Gather aggregated metrics from MongoDB for the AI Forensic Prompt
 */
export const gatherForensicMetrics = async () => {
  // 1. Stage-wise breakdown
  const stageStats = await Invoice.aggregate([
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

  // 2. Document Status breakdown
  const docStats = await Invoice.aggregate([
    {
      $group: {
        _id: '$documentStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  // 3. Approver Workload breakdown
  const approverStats = await Invoice.aggregate([
    {
      $group: {
        _id: '$assignedApprover',
        totalAssigned: { $sum: 1 },
        delayedCount: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
      },
    },
    { $sort: { totalAssigned: -1 } },
  ]);

  // 4. Global metrics
  const globalStats = await Invoice.aggregate([
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        delayedInvoices: {
          $sum: { $cond: [{ $eq: ['$isDelayed', true] }, 1, 0] },
        },
        totalFinancialLoss: { $sum: '$estimatedFinancialLoss' },
        avgOverallDaysStuck: { $avg: '$daysStuck' },
      },
    },
  ]);

  const global = globalStats[0] || {
    totalInvoices: 0,
    delayedInvoices: 0,
    totalFinancialLoss: 0,
    avgOverallDaysStuck: 0,
  };

  // Find primary bottleneck stage based on maximum delayed count and average days stuck
  let primaryBottleneck = 'Manager Approval';
  let maxScore = -1;

  for (const s of stageStats) {
    const slaTarget = STAGE_SLA_TARGETS[s._id] || 2;
    const excessDelay = Math.max(0, (s.avgDaysStuck || 0) - slaTarget);
    const score = excessDelay * 2 + (s.delayedCount || 0);
    if (score > maxScore) {
      maxScore = score;
      primaryBottleneck = s._id;
    }
  }

  return {
    global,
    stageStats,
    docStats,
    approverStats,
    primaryBottleneck,
  };
};

/**
 * Generate algorithmic fallback forensic report if Gemini API key is missing or call fails
 */
export const generateAlgorithmicForensics = (metrics) => {
  const { global, stageStats, docStats, approverStats, primaryBottleneck } = metrics;
  const bottleneckData = stageStats.find((s) => s._id === primaryBottleneck) || {};
  const avgDelayDays = Math.round((bottleneckData.avgDaysStuck || global.avgOverallDaysStuck || 3.8) * 10) / 10;
  const financialLoss = global.totalFinancialLoss || 0;

  // Compute root causes
  const totalDocs = docStats.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const missingGST = docStats.find((d) => d._id === 'Missing GST')?.count || 0;
  const poMismatch = docStats.find((d) => d._id === 'PO Mismatch')?.count || 0;
  const taxPending = docStats.find((d) => d._id === 'Tax Pending')?.count || 0;

  const docIssuePercentage = Math.min(
    75,
    Math.round(((missingGST + poMismatch + taxPending) / totalDocs) * 100)
  );

  const topApprover = approverStats[0] || { _id: 'Manager A', totalAssigned: 0, delayedCount: 0 };
  const approverOverloadPct = Math.max(25, 100 - docIssuePercentage);

  return {
    primaryBottleneck: `${primaryBottleneck} Stage`,
    averageDelayDays: avgDelayDays,
    financialLossINR: financialLoss,
    rootCauseBreakdown: [
      {
        cause: `Vendor Documentation Inconsistencies (${missingGST} Missing GST, ${poMismatch} PO Mismatch)`,
        percentage: docIssuePercentage > 0 ? docIssuePercentage : 60,
      },
      {
        cause: `Approval Workload Saturation on ${topApprover._id || 'Manager A'} (${topApprover.delayedCount || 0} overdue)`,
        percentage: approverOverloadPct,
      },
    ],
    executiveSummary: `${primaryBottleneck} Stage represents the critical process bottleneck with an average cycle time of ${avgDelayDays} days. Primary operational drag stems from non-compliant vendor documentation and queue saturation on ${topApprover._id || 'Manager A'}, accumulating ₹${financialLoss.toLocaleString('en-IN')} in at-risk SLA penalties and forfeited early-payment discounts.`,
    recommendedActions: [
      'Dispatch automated document upload links to blocked vendors via FinFlow One-Click Portal',
      `Auto-reroute SLA-violated items from ${topApprover._id || 'Manager A'} to certified alternate co-approvers`,
      'Synchronize updated status with SAP S/4HANA OData pipeline to release blocked accounts payable',
    ],
    meta: {
      generatedBy: 'FinFlow AI Heuristic Forensic Engine (Local)',
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Execute AI Forensic Analysis using Google Gemini API (with gemini-3.8-flash as primary)
 */
export const runAIForensicAnalysis = async () => {
  const metrics = await gatherForensicMetrics();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return generateAlgorithmicForensics(metrics);
  }

  // Waterfall of top tier models: gemini-3.8-flash -> gemini-3.6-flash -> gemini-3.5-flash -> gemini-flash-latest
  const modelWaterfall = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    'gemini-3.8-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
  ];
  // Remove duplicates
  const uniqueModels = Array.from(new Set(modelWaterfall));

  const prompt = `
You are the Chief AI Forensic Auditor for FinFlow AI, analyzing enterprise Financial Accounts Payable & SAP workflows.
Analyze the following live database metrics and return a STRICT JSON object diagnosing the financial bottlenecks.

LIVE SYSTEM METRICS:
- Total Invoices: ${metrics.global.totalInvoices}
- Delayed Invoices: ${metrics.global.delayedInvoices}
- Total Financial Loss (INR): ₹${metrics.global.totalFinancialLoss}
- Identified Primary Bottleneck Stage: ${metrics.primaryBottleneck}
- Stage Statistics: ${JSON.stringify(metrics.stageStats)}
- Document Status Breakdown: ${JSON.stringify(metrics.docStats)}
- Approver Workload Distribution: ${JSON.stringify(metrics.approverStats)}

CRITICAL INSTRUCTIONS:
- You must return ONLY a valid, parseable JSON object matching this exact structure:
{
  "primaryBottleneck": "string (e.g., Manager Approval Stage)",
  "averageDelayDays": number (e.g., 4.8),
  "financialLossINR": number (e.g., 485000),
  "rootCauseBreakdown": [
    { "cause": "string", "percentage": number }
  ],
  "executiveSummary": "string",
  "recommendedActions": [
    "string",
    "string"
  ]
}
- Percentages in rootCauseBreakdown must sum to 100.
- Financial Loss must reflect actual numbers provided in the metrics.
- Do NOT wrap in markdown backticks or commentary; return raw JSON only.
`;

  for (const modelName of uniqueModels) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const partWithText = data.candidates?.[0]?.content?.parts?.find(
          (p) => p && typeof p.text === 'string'
        );
        if (partWithText?.text) {
          const cleanText = partWithText.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          parsed.meta = {
            generatedBy: `Google Gemini (${data.modelVersion || modelName})`,
            model: data.modelVersion || modelName,
            status: 'LIVE_AI_GENERATED',
            timestamp: new Date().toISOString(),
          };
          return parsed;
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn(`⚠️ Model ${modelName} returned status ${response.status}:`, errJson?.error?.message || errJson);
      }
    } catch (modelErr) {
      console.warn(`⚠️ Error calling ${modelName}:`, modelErr.message);
    }
  }

  // Fallback to local heuristic engine
  console.warn('⚠️ All Gemini cloud models unavailable or rate-limited. Engaging FinFlow Heuristic Forensic engine.');
  const fallback = generateAlgorithmicForensics(metrics);
  fallback.meta.warning = 'Cloud AI temporarily unavailable. Algorithmic forensic diagnosis engaged.';
  return fallback;
};
