export function squashAccountName(account: string): string {
  return `${account.slice(0, 6)}...${account.slice(-4)}`;
}

export const ethDecimals = 18;
