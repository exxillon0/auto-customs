export function toUsd(amount: number, currency: "BYN" | "EUR" | "USD", rates: { usdToByn: number; eurToUsd: number }): number {
  if (currency === "USD") return amount;
  if (currency === "BYN") return amount / rates.usdToByn;
  if (currency === "EUR") return amount * rates.eurToUsd;
  return amount;
}