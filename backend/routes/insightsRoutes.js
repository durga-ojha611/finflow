import express from 'express';
import { getAIForensicAnalysis } from '../controllers/insightsController.js';

const router = express.Router();

router.get('/analysis', getAIForensicAnalysis);

export default router;
