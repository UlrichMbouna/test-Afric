export type TransactionType = 'credit' | 'debit';

export interface AccountingJournal {
  // UUID
  id: string;
  // UUID
  accountId: string;

  direction: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter?: number;

  // ISO date
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
