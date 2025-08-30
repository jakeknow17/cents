export interface Transaction {
  id: number;
  description: string;
  vendorId: number;
  categoryId: number;
  amount: number;
  date: string; // ISO date string
  type: 'expense' | 'income';
  notes?: string;
  tags?: string[];
  accountId?: number;
  recurring?: boolean;
  status: 'completed' | 'pending' | 'cancelled';
}
