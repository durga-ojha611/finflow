import mongoose from 'mongoose';
import {
  calculateDaysStuck,
  calculateIsDelayed,
  calculateFinancialLoss,
} from '../utils/calculationHelpers.js';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: [true, 'Invoice ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: [true, 'Vendor Name is required'],
      trim: true,
      index: true,
    },
    vendorCode: {
      type: String,
      trim: true,
    },
    poNumber: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Invoice amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: {
        values: ['Procurement', 'Operations', 'IT', 'Marketing'],
        message: '{VALUE} is not a valid department',
      },
      index: true,
    },
    currentStage: {
      type: String,
      required: true,
      enum: {
        values: [
          'Invoice Receipt',
          'Verification',
          'Manager Approval',
          'Payment Disbursement',
        ],
        message: '{VALUE} is not a valid stage',
      },
      index: true,
    },
    sapRawStatus: {
      type: String,
      required: true,
      enum: {
        values: [
          'SYNCED',
          'PENDING_APPROVAL_SLA',
          'BLOCKED_M8082',
          'MISSING_DOCS',
          'RESOLVED',
        ],
        message: '{VALUE} is not a valid SAP raw status',
      },
      default: 'SYNCED',
      index: true,
    },
    documentStatus: {
      type: String,
      required: true,
      enum: {
        values: ['Complete', 'Missing GST', 'PO Mismatch', 'Tax Pending'],
        message: '{VALUE} is not a valid document status',
      },
      default: 'Complete',
      index: true,
    },
    assignedApprover: {
      type: String,
      trim: true,
      default: 'Manager A',
      index: true,
    },
    correctionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    receivedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    approvalDueDate: {
      type: Date,
      index: true,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    daysStuck: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDelayed: {
      type: Boolean,
      default: false,
      index: true,
    },
    estimatedFinancialLoss: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to compute dynamic fields
invoiceSchema.pre('save', function (next) {
  // If no approvalDueDate provided, default to receivedDate + 7 days
  if (!this.approvalDueDate && this.receivedDate) {
    const due = new Date(this.receivedDate);
    due.setDate(due.getDate() + 7);
    this.approvalDueDate = due;
  }

  // Calculate days stuck
  this.daysStuck = calculateDaysStuck(this.receivedDate, this.completedDate);

  // If status is marked RESOLVED, clear delay and loss
  if (this.sapRawStatus === 'RESOLVED') {
    this.isDelayed = false;
    this.estimatedFinancialLoss = 0;
  } else {
    // Calculate isDelayed
    this.isDelayed = calculateIsDelayed(
      this.approvalDueDate,
      this.completedDate,
      this.sapRawStatus
    );

    // Calculate estimated financial loss (2% early discount loss + SLA daily penalties)
    this.estimatedFinancialLoss = calculateFinancialLoss(
      this.amount,
      this.isDelayed,
      this.approvalDueDate,
      this.completedDate,
      this.sapRawStatus
    );
  }

  next();
});

// Helper static method to recalculate metrics on demand
invoiceSchema.statics.recalculateAll = async function () {
  const invoices = await this.find({});
  for (const inv of invoices) {
    inv.daysStuck = calculateDaysStuck(inv.receivedDate, inv.completedDate);
    if (inv.sapRawStatus === 'RESOLVED') {
      inv.isDelayed = false;
      inv.estimatedFinancialLoss = 0;
    } else {
      inv.isDelayed = calculateIsDelayed(
        inv.approvalDueDate,
        inv.completedDate,
        inv.sapRawStatus
      );
      inv.estimatedFinancialLoss = calculateFinancialLoss(
        inv.amount,
        inv.isDelayed,
        inv.approvalDueDate,
        inv.completedDate,
        inv.sapRawStatus
      );
    }
    await inv.save();
  }
};

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
