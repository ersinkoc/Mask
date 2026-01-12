/**
 * @oxog/mask - Output Formats
 *
 * Implementation of various output formatting options for masked values.
 */

import type { MaskFormat, FormatHandler } from './types';
import { InvalidFormatError } from './errors';

/**
 * Apply a format to a masked value.
 *
 * @param value - The masked value
 * @param type - The masker type (email, phone, card, etc.)
 * @param format - The format to apply
 * @returns The formatted value
 *
 * @example
 * ```typescript
 * applyFormat("****1234", 'card', 'display');    // → "**** **** **** 1234"
 * applyFormat("****1234", 'card', 'compact');   // → "************1234"
 * applyFormat("e***n@o***.dev", 'email', 'log'); // → "[REDACTED:email]"
 * ```
 */
export function applyFormat(
  value: string,
  type: string,
  format: MaskFormat
): string {
  const handler = formats[format];

  if (!handler) {
    throw new InvalidFormatError(format);
  }

  return handler(value, type);
}

/**
 * Validate a format value.
 *
 * @param format - The format to validate
 * @returns True if the format is valid
 *
 * @example
 * ```typescript
 * isValidFormat('display');  // → true
 * isValidFormat('compact');  // → true
 * isValidFormat('log');      // → true
 * isValidFormat('invalid');  // → false
 * ```
 */
export function isValidFormat(format: string): format is MaskFormat {
  return format === 'display' || format === 'compact' || format === 'log';
}

/**
 * Get all available formats.
 *
 * @returns Array of format names
 *
 * @example
 * ```typescript
 * getFormats();
 * // → ['display', 'compact', 'log']
 * ```
 */
export function getFormats(): MaskFormat[] {
  return ['display', 'compact', 'log'];
}

/**
 * Format handler implementations.
 * Each format transforms the masked value for different use cases.
 */
const formats: Record<MaskFormat, FormatHandler> = {
  /**
   * Display format - Human-readable with appropriate spacing.
   * For cards: adds spaces every 4 digits.
   * For phones: maintains original spacing if present.
   * For others: keeps as-is.
   */
  display: (value: string, type: string): string => {
    switch (type) {
      case 'card': {
        // Add spaces every 4 characters for card numbers
        // Preserve masked characters and actual digits
        const result = [];
        for (let i = 0; i < value.length; i += 4) {
          result.push(value.substring(i, i + 4));
        }
        return result.join(' ');
      }

      case 'phone': {
        // For phones, try to preserve original format if it looks like it had formatting
        // Otherwise, use a simple format: +CC XXX XXX XXXX
        const digits = value.replace(/\D/g, '');

        // If it starts with +, preserve the country code
        if (value.includes('+')) {
          const match = value.match(/^(\+\d{1,4})(\d+)$/);
          if (match && match[1] && match[2]) {
            const countryCode = match[1];
            const number = match[2];

            // Format as +CC XXX XXX XXXX
            if (number.length >= 10) {
              const first3 = number.substring(0, 3);
              const middle3 = number.substring(3, 6);
              const last4 = number.substring(6, 10);

              return `${countryCode} ${first3} ${middle3} ${last4}`;
            }
          }
        }

        // Simple format for shorter numbers
        if (digits.length >= 10) {
          const first3 = digits.substring(0, 3);
          const middle3 = digits.substring(3, 6);
          const last4 = digits.substring(6, 10);

          return `(${first3}) ${middle3}-${last4}`;
        }

        return value;
      }

      case 'iban': {
        // Group IBAN into 4-character groups
        const groups = value.replace(/\s/g, '').match(/.{1,4}/g);

        if (groups) {
          return groups.join(' ');
        }

        return value;
      }

      default:
        // For other types, keep the value as-is
        return value;
    }
  },

  /**
   * Compact format - No spaces or special formatting.
   * Removes all whitespace and formatting characters.
   */
  compact: (value: string, type: string): string => {
    // Remove all whitespace characters
    return value.replace(/\s/g, '');
  },

  /**
   * Log format - Structured logging format.
   * Returns a redacted placeholder instead of the masked value.
   * Useful for logs where you don't want to reveal structure.
   */
  log: (value: string, type: string): string => {
    return `[REDACTED:${type}]`;
  },
};

/**
 * Get the default format for a given masker type.
 *
 * @param type - The masker type
 * @returns The default format
 *
 * @example
 * ```typescript
 * getDefaultFormat('card');     // → 'display'
 * getDefaultFormat('email');    // → 'display'
 * getDefaultFormat('iban');     // → 'display'
 * ```
 */
export function getDefaultFormat(type: string): MaskFormat {
  // All types default to 'display' for now
  // This could be extended to have type-specific defaults
  return 'display';
}

/**
 * Check if a format is suitable for a given masker type.
 *
 * @param format - The format to check
 * @param type - The masker type
 * @returns True if the format is suitable
 *
 * @example
 * ```typescript
 * isFormatSuitable('display', 'card');  // → true
 * isFormatSuitable('log', 'email');    // → true
 * isFormatSuitable('compact', 'phone'); // → true
 * ```
 */
export function isFormatSuitable(format: MaskFormat, type: string): boolean {
  // Currently all formats are suitable for all types
  // This could be extended to restrict certain formats for certain types
  return true;
}

/**
 * Format a value for display in a UI component.
 * This is an alias for 'display' format.
 *
 * @param value - The masked value
 * @param type - The masker type
 * @returns The formatted value
 *
 * @example
 * ```typescript
 * formatForDisplay("****1234", 'card');  // → "**** **** **** 1234"
 * ```
 */
export function formatForDisplay(value: string, type: string): string {
  return formats.display(value, type);
}

/**
 * Format a value for storage in a database.
 * This is an alias for 'compact' format.
 *
 * @param value - The masked value
 * @param type - The masker type
 * @returns The formatted value
 *
 * @example
 * ```typescript
 * formatForStorage("**** 1234", 'card');  // → "************1234"
 * ```
 */
export function formatForStorage(value: string, type: string): string {
  return formats.compact(value, type);
}

/**
 * Format a value for logging.
 * This is an alias for 'log' format.
 *
 * @param value - The masked value
 * @param type - The masker type
 * @returns The formatted value
 *
 * @example
 * ```typescript
 * formatForLogging("e***n@o***.dev", 'email');  // → "[REDACTED:email]"
 * ```
 */
export function formatForLogging(value: string, type: string): string {
  return formats.log(value, type);
}
