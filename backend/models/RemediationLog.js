import mongoose from 'mongoose';

const remediationLogSchema = new mongoose.Schema(
  {
    invoiceIds: {
      type: [String],
      required: true,
      default: [],
    },
    actionType: {
      type: String,
      required: true,
      enum: {
        values: ['SLACK_PING', 'REQUEST_DOCS', 'AUTO_REROUTE'],
        message: '{VALUE} is not a valid remediation action type',
      },
      index: true,
    },
    triggeredBy: {
      type: String,
      default: 'Finance Admin',
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['SUCCESS', 'FAILED'],
        message: '{VALUE} is not a valid status',
      },
      default: 'SUCCESS',
      index: true,
    },
    impactSummary: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const RemediationLog = mongoose.model('RemediationLog', remediationLogSchema);
export default RemediationLog;
