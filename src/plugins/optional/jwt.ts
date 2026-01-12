/**
 * @oxog/mask - JWT Masker Plugin
 *
 * JWT (JSON Web Token) masking with selective part masking.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidJWT } from '../../utils/validation';
import { applyStrategy } from '../../strategies';

/**
 * JWT masker function.
 *
 * @param value - The JWT token to mask
 * @param options - Masking options
 * @returns The masked JWT token
 *
 * @example
 * ```typescript
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
 *
 * maskJWT(token, { strategy: 'full' });
 * // → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*************.*******************"
 *
 * maskJWT(token, { strategy: 'middle' });
 * // → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwI***.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
 * ```
 */
function maskJWT(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('JWT must be a string', { value, type: 'jwt' });
  }

  // Validate JWT format
  if (!isValidJWT(value)) {
    throw new InvalidValueError('Invalid JWT format', { value, type: 'jwt' });
  }

  // Split JWT into parts
  const parts = value.split('.');

  if (parts.length !== 3) {
    throw new InvalidValueError('Invalid JWT format (must have 3 parts)', { value, type: 'jwt' });
  }

  const [header, payload, signature] = parts as [string, string, string];

  // Default strategy
  const strategy = options.strategy || 'middle';
  const char = options.char || '*';

  // Mask each part according to strategy
  let maskedHeader = header;
  let maskedPayload = payload;
  let maskedSignature = signature;

  if (strategy === 'full') {
    // Mask everything
    maskedHeader = char.repeat(header.length);
    maskedPayload = char.repeat(payload.length);
    maskedSignature = char.repeat(signature.length);
  } else if (strategy === 'first:2') {
    // Show first 2 chars of each part
    maskedHeader = header.substring(0, 2) + char.repeat(header.length - 2);
    maskedPayload = payload.substring(0, 2) + char.repeat(payload.length - 2);
    maskedSignature = signature.substring(0, 2) + char.repeat(signature.length - 2);
  } else if (strategy === 'last:2') {
    // Show last 2 chars of each part
    maskedHeader = char.repeat(header.length - 2) + header.substring(header.length - 2);
    maskedPayload = char.repeat(payload.length - 2) + payload.substring(payload.length - 2);
    maskedSignature = char.repeat(signature.length - 2) + signature.substring(signature.length - 2);
  } else if (strategy === 'middle') {
    // Show first and last char of each part
    maskedHeader = header[0] + char.repeat(header.length - 2) + header[header.length - 1];
    maskedPayload = payload[0] + char.repeat(payload.length - 2) + payload[payload.length - 1];
    maskedSignature = signature[0] + char.repeat(signature.length - 2) + signature[signature.length - 1];
  } else {
    // Apply strategy to each part uniformly
    maskedHeader = applyStrategy(header, strategy, char);
    maskedPayload = applyStrategy(payload, strategy, char);
    maskedSignature = applyStrategy(signature, strategy, char);
  }

  return `${maskedHeader}.${maskedPayload}.${maskedSignature}`;
}

/**
 * Parse JWT header.
 *
 * @param value - The JWT token
 * @returns Parsed header object or null if invalid
 *
 * @example
 * ```typescript
 * parseJWTHeader(token);
 * // → { alg: "HS256", typ: "JWT" }
 * ```
 */
export function parseJWTHeader(value: string): Record<string, unknown> | null {
  try {
    const parts = value.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = atob((parts[0] || '').replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Parse JWT payload.
 *
 * @param value - The JWT token
 * @returns Parsed payload object or null if invalid
 *
 * @example
 * ```typescript
 * parseJWTPayload(token);
 * // → { sub: "1234567890", name: "John Doe", iat: 1516239022 }
 * ```
 */
export function parseJWTPayload(value: string): Record<string, unknown> | null {
  try {
    const parts = value.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = atob((parts[1] || '').replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Get JWT part.
 *
 * @param value - The JWT token
 * @param part - Which part (0=header, 1=payload, 2=signature)
 * @returns The part or null if invalid
 *
 * @example
 * ```typescript
 * getJWTPart(token, 0);  // → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 * getJWTPart(token, 1);  // → "eyJzdWIiOiIxMjM0NTY3ODkwIn0"
 * ```
 */
export function getJWTPart(value: string, part: number): string | null {
  const parts = value.split('.');
  if (parts.length !== 3 || part < 0 || part > 2) {
    return null;
  }
  return parts[part] || null;
}

/**
 * JWT masker plugin.
 * Provides JWT token masking functionality.
 *
 * @example
 * ```typescript
 * import { jwt } from '@oxog/mask/plugins/jwt';
 *
 * const mask = createMask();
 * mask.use(jwt());
 * mask.jwt(token);
 * // → Masked JWT token
 * ```
 */
export function jwt(): MaskPlugin {
  return {
    name: 'jwt',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('jwt', maskJWT);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskJWTFunction = maskJWT;
