export interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  description: string;
  notes?: string;
  tagIds: string[];
  categoryId?: number;
  vendorId?: number;
  accountId?: number;
}
