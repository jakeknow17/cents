export const AccountType = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  CREDIT: "CREDIT",
  INVESTMENT: "INVESTMENT",
  VENMO: "VENMO",
  OTHER: "OTHER",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export interface Account {
  id: number;
  name: string;
  type: AccountType;
}
