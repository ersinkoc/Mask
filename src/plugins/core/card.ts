/**
 * @oxog/mask - Card Masker Plugin
 *
 * Credit/debit card masking with format preservation and last 4 digits.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidCard } from '../../utils/validation';
import { applyStrategy } from '../../strategies';
import { applyFormat } from '../../formats';

/**
 * Card masker function.
 *
 * @param value - The card number to mask
 * @param options - Masking options
 * @returns The masked card number
 *
 * @example
 * ```typescript
 * maskCard("4532015112830366", { strategy: 'middle' });
 * // → "**** **** **** 0366"
 *
 * maskCard("4532015112830366", {
 *   strategy: 'first:6',
 *   format: 'compact'
 * });
 * // → "453201**********"
 * ```
 */
function maskCard(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('Card must be a string', { value, type: 'card' });
  }

  // Validate card format
  if (!isValidCard(value)) {
    throw new InvalidValueError('Invalid card number (Luhn check failed)', { value, type: 'card' });
  }

  // Extract digits only for masking
  const digits = value.replace(/\D/g, '');

  // Default strategy for cards: show last 4, mask the rest
  const strategy = options.strategy || 'last:4';
  const char = options.char || '*';

  // Apply strategy to the digits
  const maskedDigits = applyStrategy(digits, strategy, char);

  // Apply format
  const format = options.format || 'display';
  const maskedCard = applyFormat(maskedDigits, 'card', format);

  return maskedCard;
}

/**
 * Get the last 4 digits of a card number.
 *
 * @param value - The card number
 * @returns The last 4 digits or '****' if invalid
 *
 * @example
 * ```typescript
 * getLastFour("4532015112830366");
 * // → "0366"
 *
 * getLastFour("123");
 * // → "****"
 * ```
 */
export function getLastFour(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length < 4) {
    return '****';
  }

  return digits.slice(-4);
}

/**
 * Get the card type based on the number (Visa, Mastercard, etc.).
 *
 * @param value - The card number
 * @returns The card type or 'unknown'
 *
 * @example
 * ```typescript
 * getCardType("4532015112830366");
 * // → "visa"
 *
 * getCardType("5555555555554444");
 * // → "mastercard"
 * ```
 */
export function getCardType(value: string): string {
  const digits = value.replace(/\D/g, '');

  // Visa
  if (/^4/.test(digits)) {
    return 'visa';
  }

  // Mastercard
  if (/^5[1-5]/.test(digits)) {
    return 'mastercard';
  }

  // American Express
  if (/^3[47]/.test(digits)) {
    return 'amex';
  }

  // Discover
  if (/^6(?:011|5)/.test(digits)) {
    return 'discover';
  }

  return 'unknown';
}

/**
 * Card masker plugin.
 * Provides credit/debit card masking functionality.
 *
 * @example
 * ```typescript
 * import { card } from '@oxog/mask/plugins/core/card';
 *
 * const mask = createMask();
 * mask.use(card());
 * mask.card("4532015112830366");
 * // → "**** **** **** 0366"
 * ```
 */
export function card(): MaskPlugin {
  return {
    name: 'card',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('card', maskCard);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskCardFunction = maskCard;
