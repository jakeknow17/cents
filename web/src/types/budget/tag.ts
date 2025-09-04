import type { Transaction } from "./transaction";

export interface Tag {
  id: number;
  name: string;
  transactions: Transaction[];
}
