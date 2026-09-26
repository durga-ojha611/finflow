import Invoice from '../models/Invoice.js';
import RemediationLog from '../models/RemediationLog.js';
import {
  calculateDaysStuck,
  calculateIsDelayed,
  calculateFinancialLoss,
} from './calculationHelpers.js';

const VENDORS = [
  { name: 'Tata Steel Ltd', code: 'VEND-TSL-01' },
  { name: 'Infosys BPM Solutions', code: 'VEND-INF-02' },
  { name: 'Reliance Industrial Logistics', code: 'VEND-RIL-03' },
  { name: 'Larsen & Toubro Engineering', code: 'VEND-LT-04' },
  { name: 'Wipro Cloud Managed Services', code: 'VEND-WIP-05' },
  { name: 'Mahindra Tech Systems', code: 'VEND-MTS-06' },
  { name: 'Bharti Airtel Enterprise', code: 'VEND-BAE-07' },
  { name: 'Adani Energy Infrastructure', code: 'VEND-AEI-08' },
  { name: 'HCL Technologies Software', code: 'VEND-HCL-09' },
  { name: 'Cisco Systems India', code: 'VEND-CS-10' },
  { name: 'Schneider Electric Infra', code: 'VEND-SEI-11' },
  { name: 'Cognizant Technology Solutions', code: 'VEND-CTS-12' },
];

const DEPARTMENTS = ['Procurement', 'Operations', 'IT', 'Marketing'];
const STAGES = [
  'Invoice Receipt',
  'Verification',
  'Manager Approval',
  'Payment Disbursement',
];
const APPROVERS = ['Manager A', 'Manager A', 'Manager A', 'Manager B', 'Manager C', 'Manager D']; // Skewed heavily to Manager A

/**
 * Generate 115 realistic enterprise financial invoices
 */
export const generateSeedInvoices = () => {
  const invoices = [];
  const now = new Date();

  for (let i = 1; i <= 115; i++) {
    const invNumber = 1000 + i;
    const invoiceId = `INV-2026-${invNumber}`;
    const vendor = VENDORS[i % VENDORS.length];
    const poNumber = `PO-77${(2000 + i).toString().slice(-4)}`;
    const department = DEPARTMENTS[i % DEPARTMENTS.length];

    // Distribute stages with highest concentration in Manager Approval & Verification
    let stage;
    if (i % 5 === 0) stage = 'Invoice Receipt';
    else if (i % 5 === 1 || i % 5 === 2) stage = 'Verification';
    else if (i % 5 === 3) stage = 'Payment Disbursement';
    else stage = 'Manager Approval';

    // Amounts range between ₹45,000 and ₹3,500,000
    const baseAmounts = [75000, 180000, 320000, 485000, 890000, 1250000, 2400000, 3150000];
    const amount = baseAmounts[i % baseAmounts.length] + ((i * 373) % 25000);

    // Date generation: 3 to 35 days ago
    const daysAgo = 3 + (i % 32);
    const receivedDate = new Date(now);
    receivedDate.setDate(receivedDate.getDate() - daysAgo);

    // Approval Due Date: 5 to 7 days after received date
    const approvalDueDate = new Date(receivedDate);
    const slaDays = (i % 4 === 0) ? 4 : 6;
    approvalDueDate.setDate(approvalDueDate.getDate() + slaDays);

    // Document status & SAP Status logic:
    // Heavy skew toward Missing GST & PO Mismatch for delayed items
    let documentStatus = 'Complete';
    let sapRawStatus = 'SYNCED';
    let correctionCount = 0;
    let completedDate = null;
    let assignedApprover = APPROVERS[i % APPROVERS.length];

    // Determine completion or in-flight delay
    const isOverdue = now > approvalDueDate;

    if (i % 8 === 0) {
      // Completed items
      sapRawStatus = 'RESOLVED';
      documentStatus = 'Complete';
      completedDate = new Date(approvalDueDate);
      completedDate.setDate(completedDate.getDate() - 1);
    } else if (isOverdue) {
      if (i % 3 === 0) {
        documentStatus = 'Missing GST';
        sapRawStatus = 'MISSING_DOCS';
        correctionCount = 2;
      } else if (i % 3 === 1) {
        documentStatus = 'PO Mismatch';
        sapRawStatus = 'BLOCKED_M8082';
        correctionCount = 3;
      } else {
        documentStatus = (i % 2 === 0) ? 'Tax Pending' : 'Complete';
        sapRawStatus = 'PENDING_APPROVAL_SLA';
        correctionCount = 1;
      }
    } else {
      if (i % 7 === 0) {
        documentStatus = 'Tax Pending';
        sapRawStatus = 'MISSING_DOCS';
      } else {
        documentStatus = 'Complete';
        sapRawStatus = 'SYNCED';
      }
    }

    const daysStuck = calculateDaysStuck(receivedDate, completedDate);
    const isDelayed = sapRawStatus === 'RESOLVED' ? false : calculateIsDelayed(approvalDueDate, completedDate, sapRawStatus);
    const estimatedFinancialLoss = calculateFinancialLoss(
      amount,
      isDelayed,
      approvalDueDate,
      completedDate,
      sapRawStatus
    );

    invoices.push({
      invoiceId,
      vendorName: vendor.name,
      vendorCode: vendor.code,
      poNumber,
      amount,
      currency: 'INR',
      department,
      currentStage: stage,
      sapRawStatus,
      documentStatus,
      assignedApprover,
      correctionCount,
      receivedDate,
      approvalDueDate,
      completedDate,
      daysStuck,
      isDelayed,
      estimatedFinancialLoss,
    });
  }

  return invoices;
};

/**
 * Seed database with initial dataset
 */
export const seedDatabase = async () => {
  console.log('🌱 Dropping existing Invoice and Remediation collections...');
  await Invoice.deleteMany({});
  await RemediationLog.deleteMany({});

  const seedInvoices = generateSeedInvoices();
  const createdInvoices = await Invoice.insertMany(seedInvoices);
  console.log(`✅ Seeded ${createdInvoices.length} invoices successfully.`);

  // Seed initial remediation log for audit trail continuity
  const initialLog = await RemediationLog.create({
    invoiceIds: ['INV-2026-1002', 'INV-2026-1007'],
    actionType: 'SLACK_PING',
    triggeredBy: 'System Auto-Daemon',
    status: 'SUCCESS',
    impactSummary: 'Dispatched automated escalation reminder to Manager A for 2 invoices exceeding 72h SLA limit.',
    timestamp: new Date(Date.now() - 3600000 * 24),
  });

  return {
    invoicesCount: createdInvoices.length,
    initialLogId: initialLog._id,
  };
};
