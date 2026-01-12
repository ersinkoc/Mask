/**
 * @oxog/mask - Auto-Detect Plugin
 *
 * Automatic field type detection by field name patterns.
 */

import type { MaskPlugin, FieldMapping } from '../../types';

/**
 * Configuration for auto-detect plugin.
 */
export interface AutoDetectConfig {
  /** Patterns to match field names to masker types */
  patterns?: Record<string, string>;

  /** Whether to enable strict mode (fail on conflicts) */
  strict?: boolean;
}

/**
 * Default patterns for auto-detection.
 */
const DEFAULT_PATTERNS: Record<string, string> = {
  // Email patterns
  'email': 'email',
  'e-mail': 'email',
  'emailaddress': 'email',
  'email_address': 'email',
  'emailAddress': 'email',
  'mail': 'email',

  // Phone patterns
  'phone': 'phone',
  'phoneNumber': 'phone',
  'phone_number': 'phone',
  'phonenumber': 'phone',
  'mobile': 'phone',
  'cell': 'phone',
  'telephone': 'phone',
  'tel': 'phone',

  // Card patterns
  'card': 'card',
  'cardNumber': 'card',
  'card_number': 'card',
  'cardnumber': 'card',
  'creditCard': 'card',
  'credit_card': 'card',
  'creditcard': 'card',
  'cc': 'card',
  'ccnumber': 'card',
  'cc_number': 'card',

  // IBAN patterns
  'iban': 'iban',
  'bankAccount': 'iban',
  'bank_account': 'iban',
  'bankaccount': 'iban',
  'accountNumber': 'iban',
  'account_number': 'iban',

  // IP patterns
  'ip': 'ip',
  'ipAddress': 'ip',
  'ip_address': 'ip',
  'ipaddress': 'ip',
  'ipv4': 'ip',
  'ipv6': 'ip',

  // JWT patterns
  'jwt': 'jwt',
  'token': 'jwt',
  'authToken': 'jwt',
  'auth_token': 'jwt',
  'accesstoken': 'jwt',
  'accessToken': 'jwt',

  // SSN patterns
  'ssn': 'ssn',
  'socialSecurity': 'ssn',
  'social_security': 'ssn',
  'socialsecurity': 'ssn',
  'socialSecurityNumber': 'ssn',
  'social_security_number': 'ssn',

  // URL patterns
  'url': 'url',
  'website': 'url',
  'link': 'url',
  'href': 'url',
};

/**
 * Detect masker type from field name.
 *
 * @param fieldName - The field name
 * @param patterns - Patterns to match against
 * @returns The masker type or undefined if not matched
 *
 * @example
 * ```typescript
 * detectMaskerType('email_address');  // → 'email'
 * detectMaskerType('phone_number');   // → 'phone'
 * detectMaskerType('unknown_field');   // → undefined
 * ```
 */
function detectMaskerType(
  fieldName: string,
  patterns: Record<string, string>
): string | undefined {
  // Normalize field name (lowercase, remove underscores and dashes)
  const normalized = fieldName.toLowerCase().replace(/[_-]/g, '');

  // Try exact match first
  if (patterns[normalized]) {
    return patterns[normalized];
  }

  // Try partial matches
  for (const [pattern, maskerType] of Object.entries(patterns)) {
    // Check if pattern is contained in field name
    if (normalized.includes(pattern)) {
      return maskerType;
    }
  }

  return undefined;
}

/**
 * Generate field mapping from object keys using auto-detection.
 *
 * @param obj - The object to analyze
 * @param patterns - Patterns to match against
 * @param config - Configuration options
 * @returns Generated field mapping
 *
 * @example
 * ```typescript
 * const user = {
 *   email: "test@example.com",
 *   phoneNumber: "+1234567890",
 *   cardNumber: "1234567890123456",
 *   name: "John Doe"
 * };
 *
 * autoDetectFields(user);
 * // → { email: 'email', phoneNumber: 'phone', cardNumber: 'card' }
 * ```
 */
export function autoDetectFields(
  obj: Record<string, unknown>,
  patterns: Record<string, string> = DEFAULT_PATTERNS,
  config: AutoDetectConfig = {}
): FieldMapping {
  const mapping: FieldMapping = {};

  for (const [fieldName, value] of Object.entries(obj)) {
    const maskerType = detectMaskerType(fieldName, patterns);

    if (maskerType) {
      // Check for conflicts
      if (config.strict && mapping[fieldName] && mapping[fieldName] !== maskerType) {
        throw new Error(
          `Conflicting masker types for field "${fieldName}": ${mapping[fieldName]} vs ${maskerType}`
        );
      }

      mapping[fieldName] = maskerType;
    }
  }

  return mapping;
}

/**
 * Auto-detect plugin.
 * Provides automatic field type detection by name.
 *
 * @param config - Configuration options
 * @returns The plugin
 *
 * @example
 * ```typescript
 * import { autoDetect } from '@oxog/mask/plugins/auto-detect';
 *
 * const mask = createMask();
 * mask.use(autoDetect());
 *
 * // Auto-detect fields in an object
 * mask(user); // Automatically detects email, phone, card fields
 * ```
 */
export function autoDetect(config: AutoDetectConfig = {}): MaskPlugin {
  return {
    name: 'auto-detect',
    version: '1.0.0',
    install(kernel) {
      // This plugin doesn't register maskers
      // It provides utility functions for auto-detection
      // The actual masking is done by the kernel's traversal engine
    },
    onInit(context) {
      // Store patterns and config in context for later use
      // This will be used by the object traversal engine
      (context as Record<string, unknown>).autoDetectPatterns = config.patterns || DEFAULT_PATTERNS;
      (context as Record<string, unknown>).autoDetectConfig = config;
    },
  };
}

/**
 * Export default patterns for external use.
 */
export { DEFAULT_PATTERNS };
