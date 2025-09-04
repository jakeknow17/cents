export const AccountType = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  CREDIT: "CREDIT",
  INVESTMENT: "INVESTMENT",
  VENMO: "VENMO",
  OTHER: "OTHER",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export function isAccountType(value: string): value is AccountType {
  return (Object.values(AccountType) as readonly string[]).includes(value);
}

// returns OTHER if invalid
export function toAccountType(value: string): AccountType {
  return isAccountType(value) ? value : AccountType.OTHER;
}

export interface Account {
  id: number;
  name: string;
  type: AccountType;
}
