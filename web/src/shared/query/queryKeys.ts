export const queryKeys = {
  accounts: ["account"] as const,
  categories: ["category"] as const,
  tags: ["tag"] as const,
  transactions: ["transaction"] as const,
  vendors: ["vendor"] as const,
  account: (id: number) => ["account", id] as const,
  category: (id: number) => ["category", id] as const,
  tag: (id: number) => ["tag", id] as const,
  transaction: (id: number) => ["transaction", id] as const,
  vendor: (id: number) => ["vendor", id] as const,
};
