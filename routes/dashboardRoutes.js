import express from 'express';
import {
  getDashboardMetrics,
  getPipelineMetrics,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/metrics', getDashboardMetrics);
router.get('/pipeline', getPipelineMetrics);

export default router;
