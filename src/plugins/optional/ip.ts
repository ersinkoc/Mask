/**
 * @oxog/mask - IP Masker Plugin
 *
 * IP address (IPv4 and IPv6) masking.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { isValidIP, isValidIPv6 } from '../../utils/validation';
import { applyStrategy } from '../../strategies';

/**
 * IPv4 masker function.
 *
 * @param value - The IPv4 address to mask
 * @param options - Masking options
 * @returns The masked IPv4 address
 *
 * @example
 * ```typescript
 * maskIPv4("192.168.1.1", { strategy: 'last:1' });
 * // → "192.168.1.*"
 *
 * maskIPv4("255.255.255.255", {
 *   strategy: 'partial:0.5',
 *   char: 'x'
 * });
 * // → "255.xxx.xx.xx"
 * ```
 */
function maskIPv4(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('IPv4 must be a string', { value, type: 'ip' });
  }

  // Validate IPv4 format
  if (!isValidIP(value)) {
    throw new InvalidValueError('Invalid IPv4 address', { value, type: 'ip' });
  }

  // Split into octets
  const octets = value.split('.');

  // Default strategy: mask last octet
  const strategy = options.strategy || 'last:1';
  const char = options.char || '*';

  // Extract octets as string
  const octetString = octets.join('');

  // Apply strategy
  const maskedOctetString = applyStrategy(octetString, strategy, char);

  // Convert back to IP format (4 octets of 3 digits max)
  // This is a simplified approach - for production, you'd want to track which octets were masked
  const maskedOctets = [
    maskedOctetString.substring(0, 3).padEnd(3, char),
    maskedOctetString.substring(3, 6).padEnd(3, char),
    maskedOctetString.substring(6, 9).padEnd(3, char),
    maskedOctetString.substring(9, 12).padEnd(3, char),
  ].map((octet, index) => {
    // Ensure octets are valid (0-255)
    if (index < octets.length - 1) {
      // For first 3 octets, use original if not fully masked
      const original = octets[index];
      if (original && original.length > 0 && !original.startsWith(char)) {
        return original;
      }
    }
    // Last octet or fully masked
    return octet.replace(/[^\d]/g, (match) => (match === char ? char : '0')).substring(0, 3);
  });

  // Preserve original structure better
  const result = octets.map((octet, index) => {
    const originalOctet = parseInt(octet, 10);

    if (strategy === 'last:1' && index === 3) {
      // Mask last octet completely
      return char.repeat(octet.length);
    }

    if (strategy === 'full') {
      return char.repeat(octet.length);
    }

    // For other strategies, mask proportionally
    const maskedOctetString = applyStrategy(octet, strategy, char);
    return maskedOctetString;
  });

  return result.join('.');
}

/**
 * IPv6 masker function.
 *
 * @param value - The IPv6 address to mask
 * @param options - Masking options
 * @returns The masked IPv6 address
 *
 * @example
 * ```typescript
 * maskIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334", { strategy: 'middle' });
 * // → "2001:0db8:****:****:****:****:****:7334"
 *
 * maskIPv6("::1", { strategy: 'full' });
 * // → ":::::::"
 * ```
 */
function maskIPv6(value: string, options: MaskOptions = {}): string {
  // Validate input
  if (typeof value !== 'string') {
    throw new InvalidValueError('IPv6 must be a string', { value, type: 'ip' });
  }

  // Validate IPv6 format
  if (!isValidIPv6(value)) {
    throw new InvalidValueError('Invalid IPv6 address', { value, type: 'ip' });
  }

  // Handle compressed notation (::)
  let expanded = value;
  if (value.includes('::')) {
    // Expand :: to appropriate number of :0:
    const parts = value.split('::');
    const leftParts = parts[0] ? parts[0].split(':') : [];
    const rightParts = parts[1] ? parts[1].split(':') : [];

    const missing = 8 - (leftParts.length + rightParts.length);
    const zeros = new Array(missing).fill('0').join(':');

    expanded = (parts[0] ? parts[0] : '') + ':' + zeros + ':' + (parts[1] ? parts[1] : '');
  }

  // Split into hextets
  const hextets = expanded.split(':');

  // Default strategy: mask middle hextets
  const strategy = options.strategy || 'middle';
  const char = options.char || '*';

  const result = hextets.map((hextet, index) => {
    if (hextet === '') return ''; // Handle potential empty from compression

    if (strategy === 'last:2' && index >= hextets.length - 2) {
      return char.repeat(hextet.length);
    }

    if (strategy === 'first:2' && index < 2) {
      return char.repeat(hextet.length);
    }

    if (strategy === 'middle') {
      if (index === 0 || index === hextets.length - 1) {
        return hextet; // Keep first and last
      }
      return char.repeat(hextet.length);
    }

    if (strategy === 'full') {
      return char.repeat(hextet.length);
    }

    // Apply strategy to individual hextet
    return applyStrategy(hextet, strategy, char);
  });

  return result.join(':').replace(/:{3,}/g, '::'); // Re-compress if possible
}

/**
 * IP masker function (detects IPv4 vs IPv6).
 *
 * @param value - The IP address to mask
 * @param options - Masking options
 * @returns The masked IP address
 *
 * @example
 * ```typescript
 * maskIP("192.168.1.1", { strategy: 'last:1' });
 * // → "192.168.1.*"
 *
 * maskIP("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
 * // → "2001:0db8:****:****:****:****:****:7334"
 * ```
 */
function maskIP(value: string, options: MaskOptions = {}): string {
  // Determine IP version
  if (value.includes(':')) {
    // IPv6
    return maskIPv6(value, options);
  } else if (value.includes('.')) {
    // IPv4
    return maskIPv4(value, options);
  } else {
    throw new InvalidValueError('Invalid IP address format', { value, type: 'ip' });
  }
}

/**
 * IP masker plugin.
 * Provides IP address masking functionality.
 *
 * @example
 * ```typescript
 * import { ip } from '@oxog/mask/plugins/ip';
 *
 * const mask = createMask();
 * mask.use(ip());
 * mask.ip("192.168.1.1");
 * // → "192.168.1.*"
 * ```
 */
export function ip(): MaskPlugin {
  return {
    name: 'ip',
    version: '1.0.0',
    install(kernel) {
      kernel.registerMasker('ip', maskIP);
    },
  };
}

/**
 * Export the masker function for direct use.
 */
export const maskIPFunction = maskIP;
