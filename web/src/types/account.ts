export const AccountType = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CREDIT: 'credit',
  INVESTMENT: 'investment',
  VENMO: 'venmo',
  OTHER: 'other'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export interface Account {
  id: number;
  name: string;
  type: AccountType;
}
