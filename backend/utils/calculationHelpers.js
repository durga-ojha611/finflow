/**
 * FinFlow AI - Calculation & SLA Business Logic Helpers
 */

export const STAGE_SLA_TARGETS = {
  'Invoice Receipt': 2,
  'Verification': 3,
  'Manager Approval': 2,
  'Payment Disbursement': 2,
};

export const STAGES_ORDER = [
  'Invoice Receipt',
  'Verification',
  'Manager Approval',
  'Payment Disbursement',
];

/**
 * Calculate the number of days an invoice has been in process / stuck.
 * @param {Date|string} receivedDate
 * @param {Date|string|null} completedDate
 * @returns {number}
 */
export const calculateDaysStuck = (receivedDate, completedDate = null) => {
  if (!receivedDate) return 0;
  const start = new Date(receivedDate).getTime();
  const end = completedDate ? new Date(completedDate).getTime() : Date.now();
  const diffDays = (end - start) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(diffDays * 10) / 10);
};

/**
 * Determine if an invoice is delayed based on its approvalDueDate and status.
 * @param {Date|string} approvalDueDate
 * @param {Date|string|null} completedDate
 * @param {string} sapRawStatus
 * @returns {boolean}
 */
export const calculateIsDelayed = (approvalDueDate, completedDate = null, sapRawStatus = '') => {
  if (sapRawStatus === 'RESOLVED') return false;
  if (!approvalDueDate) return false;
  
  const due = new Date(approvalDueDate).getTime();
  const compareTime = completedDate ? new Date(completedDate).getTime() : Date.now();
  return compareTime > due;
};

/**
 * Calculate estimated financial loss for an invoice.
 * Formula:
 * - 2% lost early settlement discount on delayed invoice amount.
 * - ₹1,200 penalty per day overdue past approvalDueDate.
 * @param {number} amount
 * @param {boolean} isDelayed
 * @param {Date|string} approvalDueDate
 * @param {Date|string|null} completedDate
 * @param {string} sapRawStatus
 * @returns {number}
 */
export const calculateFinancialLoss = (
  amount,
  isDelayed,
  approvalDueDate,
  completedDate = null,
  sapRawStatus = ''
) => {
  if (!isDelayed || sapRawStatus === 'RESOLVED') return 0;
  if (!amount || amount <= 0) return 0;

  // 1. 2% Early payment discount forfeiture
  const earlyDiscountLoss = amount * 0.02;

  // 2. SLA Overdue daily penalty (₹1,200 per day overdue)
  let penaltyDays = 0;
  if (approvalDueDate) {
    const dueTime = new Date(approvalDueDate).getTime();
    const currTime = completedDate ? new Date(completedDate).getTime() : Date.now();
    if (currTime > dueTime) {
      penaltyDays = Math.max(0, Math.floor((currTime - dueTime) / (1000 * 60 * 60 * 24)));
    }
  }

  const slaPenaltyLoss = penaltyDays * 1200;
  return Math.round(earlyDiscountLoss + slaPenaltyLoss);
};
