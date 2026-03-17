export type AccountType = 'checking' | 'savings';
export type AccountStatus = 'active' | 'frozen' | 'closed';

export interface Account {
  // UUID
  id: string;
  // UUID
  userId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  // ISO date
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
