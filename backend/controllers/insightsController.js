import asyncHandler from 'express-async-handler';
import { runAIForensicAnalysis } from '../services/aiService.js';

/**
 * @desc    Trigger AI Forensic Diagnostic Engine
 * @route   GET /api/v1/insights/analysis
 * @access  Public
 */
export const getAIForensicAnalysis = asyncHandler(async (req, res) => {
  const analysis = await runAIForensicAnalysis();
  res.status(200).json({
    success: true,
    data: analysis,
  });
});
