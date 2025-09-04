export interface TransactionRequest {
  date: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  description: string;
  notes?: string;
  tagsIds: number[];
  categoryId?: number;
  vendorId?: number;
  accountId?: number;
}
