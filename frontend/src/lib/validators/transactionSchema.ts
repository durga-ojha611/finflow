import { z } from 'zod';

export const transactionSchema = z.object({
  merchant: z.string().min(2, 'Merchant or payee name is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum([
    'Housing',
    'Groceries',
    'Dining & Drinks',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Salary & Bonus',
    'Investments',
    'Freelance',
    'Other',
  ]),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
  account: z.string().optional(),
  status: z.enum(['Completed', 'Pending']).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
