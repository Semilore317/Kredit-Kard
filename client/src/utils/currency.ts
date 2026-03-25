/**
 * Extremely basic formatter rounding amounts with comma separation alongside the Naira standard prefix.
 */
export function formatCurrencyNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}
