import express from 'express';
import { getExecutiveReportSummary } from '../controllers/reportController.js';

const router = express.Router();

router.get('/summary', getExecutiveReportSummary);

export default router;
