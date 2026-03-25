/**
 * Takes a raw phone number input from a trader and fiercely maps it cleanly to to E.164.
 * Covers edge cases where traders type `080...` or `234...` or `+234...`.
 */
export function formatPhoneToE164(phone: string): string {
  // Strip all non-digit characters first, except a leading plus sign
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+234")) {
    return cleaned;
  }

  // Handle local 0
  if (cleaned.startsWith("0")) {
    return `+234${cleaned.slice(1)}`;
  }

  // Handle missing plus
  if (cleaned.startsWith("234")) {
    return `+${cleaned}`;
  }

  // Fallback: If it's just raw numbers like "8011112222", prepend +234
  return `+234${cleaned}`;
}
