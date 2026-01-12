/**
 * @oxog/mask - Email Masker Plugin
 *
 * Email address masking with domain preservation.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidEmail } from '../../utils/validation';
import { applyStrategy } from '../../strategies';
import { applyFormat } from '../../formats';

/**
 * Email masker function.
 *
 * @param value - The email to mask
 * @param options - Masking options
 * @returns The masked email
 *
 * @example
 * ```typescript
 * maskEmail("test@example.com", { strategy: 'middle' });
 * // → "t***t@e***.com"
 *
 * maskEmail("john.doe@company.co.uk", {
 *   strategy: 'first:2',
 *   format: 'log'
 * });
 * // → "[REDACTED:email]"
 * ```
 */
function maskEmail(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('Email must be a string', { value, type: 'email' });
  }

  // Validate email format
  if (!isValidEmail(value)) {
    throw new InvalidValueError('Invalid email format', { value, type: 'email' });
  }

  // Split email into local part and domain
  const atIndex = value.lastIndexOf('@');

  if (atIndex === -1) {
    throw new InvalidValueError('Invalid email format (missing @)', { value, type: 'email' });
  }

  const localPart = value.substring(0, atIndex);
  const domain = value.substring(atIndex);

  // Apply strategy to local part only
  const strategy = options.strategy || 'middle';
  const char = options.char || '*';

  const maskedLocal = applyStrategy(localPart, strategy, char);

  // Combine masked local part with domain
  const maskedEmail = maskedLocal + domain;

  // Apply format
  const format = options.format || 'display';
  const formattedEmail = applyFormat(maskedEmail, 'email', format);

  return formattedEmail;
}

/**
 * Email masker plugin.
 * Provides email address masking functionality.
 *
 * @example
 * ```typescript
 * import { email } from '@oxog/mask/plugins/core/email';
 *
 * const mask = createMask();
 * mask.use(email());
 * mask.email("test@example.com");
 * // → "t***t@e***.com"
 * ```
 */
export function email(): MaskPlugin {
  return {
    name: 'email',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('email', maskEmail);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskEmailFunction = maskEmail;
