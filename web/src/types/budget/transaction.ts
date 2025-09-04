import type { Account } from "./account";
import type { Category } from "./category";
import type { Tag } from "./tag";
import type { Vendor } from "./vendor";

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  description: string;
  notes?: string;
  tags: Tag[];
  category?: Category;
  vendor?: Vendor;
  account?: Account;
}
