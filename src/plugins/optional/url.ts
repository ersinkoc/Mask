/**
 * @oxog/mask - URL Masker Plugin
 *
 * URL masking with query parameter and credential masking.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidURL } from '../../utils/validation';
import { applyStrategy } from '../../strategies';

/**
 * URL masker function.
 *
 * @param value - The URL to mask
 * @param options - Masking options
 * @returns The masked URL
 *
 * @example
 * ```typescript
 * maskURL("https://user:pass@example.com/path?key=value", {
 *   strategy: 'full'
 * });
 * // Masked URL with all parts redacted
 *
 * maskURL("https://api.example.com/users/123?token=secret", {
 *   strategy: 'partial:0.3'
 * });
 * // Masked URL with partial masking
 * ```
 */
function maskURL(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('URL must be a string', { value, type: 'url' });
  }

  // Validate URL format
  if (!isValidURL(value)) {
    throw new InvalidValueError('Invalid URL format', { value, type: 'url' });
  }

  // Parse URL
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new InvalidValueError('Invalid URL format', { value, type: 'url' });
  }

  // Default strategy
  const strategy = options.strategy || 'full';
  const char = options.char || '*';

  // Mask credentials (username:password@)
  let maskedAuth = '';
  if (url.username || url.password) {
    const username = url.username ? applyStrategy(url.username, strategy, char) : '';
    const password = url.password ? applyStrategy(url.password, strategy, char) : '';
    maskedAuth = `${username}${password ? ':' + password : ''}@`;
  }

  // Mask hostname
  const maskedHostname = applyStrategy(url.hostname, strategy, char);

  // Mask port
  let maskedPort = '';
  if (url.port) {
    maskedPort = ':' + applyStrategy(url.port, strategy, char);
  }

  // Mask pathname
  const maskedPathname = applyStrategy(url.pathname, strategy, char);

  // Mask query parameters
  let maskedSearch = '';
  if (url.search) {
    const params = new URLSearchParams(url.search);
    const maskedParams = new URLSearchParams();

    for (const [key, val] of params.entries()) {
      const maskedKey = applyStrategy(key, strategy, char);
      const maskedVal = applyStrategy(val, strategy, char);
      maskedParams.append(maskedKey, maskedVal);
    }

    maskedSearch = '?' + maskedParams.toString();
  }

  // Mask fragment
  let maskedHash = '';
  if (url.hash) {
    maskedHash = applyStrategy(url.hash, strategy, char);
  }

  // Reconstruct URL
  const maskedURL = `${url.protocol}//${maskedAuth}${maskedHostname}${maskedPort}${maskedPathname}${maskedSearch}${maskedHash}`;

  return maskedURL;
}

/**
 * Mask query parameters in a URL.
 *
 * @param value - The URL to mask
 * @param options - Masking options
 * @returns The URL with masked query parameters
 *
 * @example
 * ```typescript
 * maskURLQueryParams("https://api.com/search?q=test&api_key=secret");
 * // → "https://api.com/search?q=****&api_key=******"
 * ```
 */
function maskURLQueryParams(value: string, options: MaskOptions = {}): string {
  const url = new URL(value);
  const params = new URLSearchParams(url.search);

  const char = options.char || '*';

  // Mask all query parameters
  const maskedParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    maskedParams.append(key, char.repeat(val.length));
  }

  url.search = maskedParams.toString();

  return url.toString();
}

/**
 * Mask credentials in a URL.
 *
 * @param value - The URL to mask
 * @param options - Masking options
 * @returns The URL with masked credentials
 *
 * @example
 * ```typescript
 * maskURLCredentials("https://user:pass@example.com");
 * // → "https://***:***@example.com"
 * ```
 */
function maskURLCredentials(value: string, options: MaskOptions = {}): string {
  const url = new URL(value);
  const char = options.char || '*';

  if (url.username) {
    url.username = char.repeat(url.username.length);
  }

  if (url.password) {
    url.password = char.repeat(url.password.length);
  }

  return url.toString();
}

/**
 * Extract query parameters from a URL.
 *
 * @param value - The URL
 * @returns Object of query parameters
 *
 * @example
 * ```typescript
 * getURLParams("https://example.com?q=test&lang=en");
 * // → { q: "test", lang: "en" }
 * ```
 */
export function getURLParams(value: string): Record<string, string> {
  const url = new URL(value);
  const params: Record<string, string> = {};

  for (const [key, val] of url.searchParams.entries()) {
    params[key] = val;
  }

  return params;
}

/**
 * Check if a URL has credentials.
 *
 * @param value - The URL
 * @returns True if URL has credentials
 *
 * @example
 * ```typescript
 * hasURLCredentials("https://user:pass@example.com");  // → true
 * hasURLCredentials("https://example.com");           // → false
 * ```
 */
export function hasURLCredentials(value: string): boolean {
  const url = new URL(value);
  return !!(url.username || url.password);
}

/**
 * URL masker plugin.
 * Provides URL masking functionality.
 *
 * @example
 * ```typescript
 * import { url } from '@oxog/mask/plugins/url';
 *
 * const mask = createMask();
 * mask.use(url());
 * mask.url("https://user:pass@example.com/path?key=value");
 * // → "https://***:***@***.com/***?***=*****"
 * ```
 */
export function url(): MaskPlugin {
  return {
    name: 'url',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('url', maskURL);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskURLFunction = maskURL;
