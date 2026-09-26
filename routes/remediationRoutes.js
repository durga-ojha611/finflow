import express from 'express';
import {
  triggerRemediation,
  fetchRemediationLogs,
} from '../controllers/remediationController.js';

const router = express.Router();

router.post('/trigger', triggerRemediation);
router.get('/logs', fetchRemediationLogs);

export default router;
