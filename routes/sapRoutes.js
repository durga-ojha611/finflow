import express from 'express';
import {
  getSAPInvoices,
  syncSAPData,
  seedSAPData,
} from '../controllers/sapController.js';

const router = express.Router();

router.get('/invoices', getSAPInvoices);
router.post('/sync', syncSAPData);
router.post('/seed', seedSAPData);

export default router;
