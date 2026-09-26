import asyncHandler from 'express-async-handler';
import {
  executeRemediation,
  getRemediationLogs,
} from '../services/remediationService.js';

/**
 * @desc    Execute 1-click autonomous remediation action
 * @route   POST /api/v1/remediation/trigger
 * @access  Public
 */
export const triggerRemediation = asyncHandler(async (req, res) => {
  const { actionType, invoiceIds, triggeredBy } = req.body;

  if (!actionType) {
    res.status(400);
    throw new Error("actionType is required ('SLACK_PING', 'REQUEST_DOCS', or 'AUTO_REROUTE')");
  }

  const result = await executeRemediation({
    actionType,
    invoiceIds,
    triggeredBy: triggeredBy || 'Finance Admin',
  });

  res.status(200).json({
    success: true,
    message: result.impactSummary,
    data: result,
  });
});

/**
 * @desc    Fetch audit log history of executed remediations
 * @route   GET /api/v1/remediation/logs
 * @access  Public
 */
export const fetchRemediationLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const logsData = await getRemediationLogs({ page, limit });

  res.status(200).json({
    success: true,
    data: logsData,
  });
});
