import asyncHandler from 'express-async-handler';
import Invoice from '../models/Invoice.js';
import { syncWithSAP } from '../services/sapSyncService.js';
import { seedDatabase } from '../utils/seedData.js';

/**
 * @desc    Fetch raw ERP invoices with pagination, filtering & search
 * @route   GET /api/v1/sap/invoices
 * @access  Public
 */
export const getSAPInvoices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status, stage, department, search, sortBy = 'receivedDate', order = 'desc' } = req.query;

  // Build filter query
  const query = {};

  if (status) {
    query.sapRawStatus = status;
  }

  if (stage) {
    query.currentStage = stage;
  }

  if (department) {
    query.department = department;
  }

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { invoiceId: searchRegex },
      { vendorName: searchRegex },
      { poNumber: searchRegex },
      { assignedApprover: searchRegex },
      { vendorCode: searchRegex },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  const total = await Invoice.countDocuments(query);
  const invoices = await Invoice.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: invoices.length,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: invoices,
  });
});

/**
 * @desc    Trigger 2-way real-time sync with SAP S/4HANA OData API
 * @route   POST /api/v1/sap/sync
 * @access  Public
 */
export const syncSAPData = asyncHandler(async (req, res) => {
  const result = await syncWithSAP();
  res.status(200).json({
    success: true,
    message: 'SAP S/4HANA 2-way synchronization completed successfully.',
    data: result,
  });
});

/**
 * @desc    Reset and seed database with 100+ realistic synthetic financial invoices
 * @route   POST /api/v1/sap/seed
 * @access  Public
 */
export const seedSAPData = asyncHandler(async (req, res) => {
  const result = await seedDatabase();
  res.status(201).json({
    success: true,
    message: `Database successfully reseeded with ${result.invoicesCount} realistic enterprise invoices.`,
    data: result,
  });
});
