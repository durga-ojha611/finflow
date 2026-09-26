import express from 'express';
import sapRoutes from './sapRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import insightsRoutes from './insightsRoutes.js';
import remediationRoutes from './remediationRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = express.Router();

// Health and metadata route for API root
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'FinFlow AI Platform API',
    version: '1.0.0',
    documentation: {
      sap: {
        invoices: 'GET /api/v1/sap/invoices',
        sync: 'POST /api/v1/sap/sync',
        seed: 'POST /api/v1/sap/seed',
      },
      dashboard: {
        metrics: 'GET /api/v1/dashboard/metrics',
        pipeline: 'GET /api/v1/dashboard/pipeline',
      },
      insights: {
        analysis: 'GET /api/v1/insights/analysis',
      },
      remediation: {
        trigger: 'POST /api/v1/remediation/trigger',
        logs: 'GET /api/v1/remediation/logs',
      },
      reports: {
        summary: 'GET /api/v1/reports/summary',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
router.use('/sap', sapRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/insights', insightsRoutes);
router.use('/remediation', remediationRoutes);
router.use('/reports', reportRoutes);

export default router;
