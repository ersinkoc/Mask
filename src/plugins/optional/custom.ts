/**
 * @oxog/mask - Custom Plugin
 *
 * Custom regex-based pattern masking plugin.
 */

import type { MaskPlugin, MaskOptions } from '../../types';
import { InvalidValueError } from '../../errors';
import { applyStrategy } from '../../strategies';

/**
 * Configuration for custom pattern plugin.
 */
export interface CustomPatternConfig {
  /** Name of the masker type */
  name: string;

  /** Regular expression to match */
  pattern: RegExp;

  /** Replacement strategy for matched values */
  strategy: 'full' | 'first' | 'last' | 'middle' | 'partial';

  /** Number of characters to show (for first/last strategies) */
  show?: number;

  /** Percentage to show (for partial strategy) */
  showPercentage?: number;

  /** Character to use for masking */
  char?: string;
}

/**
 * Custom masker function.
 *
 * @param value - The value to mask
 * @param options - Masking options
 * @returns The masked value
 *
 * @example
 * ```typescript
 * const config: CustomPatternConfig = {
 *   name: 'custom-type',
 *   pattern: /custom-pattern/g,
 *   strategy: 'middle',
 *   char: '*'
 * };
 *
 * const masker = createCustomMasker(config);
 * masker("some custom-pattern value");
 * // → "some **************** value"
 * ```
 */
function createCustomMasker(config: CustomPatternConfig) {
  return function maskCustom(value: string, options: MaskOptions = {}): string {
    // Validate input
    if (typeof value !== 'string') {
      throw new InvalidValueError('Value must be a string', { value, type: config.name });
    }

    // Extract strategy options
    const char = options.char || config.char || '*';
    let strategy = options.strategy || config.strategy;

    // Build strategy string
    if (strategy === 'first' && config.show !== undefined) {
      strategy = `first:${config.show}`;
    } else if (strategy === 'last' && config.show !== undefined) {
      strategy = `last:${config.show}`;
    } else if (strategy === 'partial' && config.showPercentage !== undefined) {
      strategy = `partial:${config.showPercentage}`;
    }

    // Replace all matches with masked versions
    return value.replace(config.pattern, (match) => {
      return applyStrategy(match, strategy as any, char);
    });
  };
}

/**
 * Create a custom plugin with patterns.
 *
 * @param patterns - Array of pattern configurations
 * @returns The plugin
 *
 * @example
 * ```typescript
 * import { custom } from '@oxog/mask/plugins/custom';
 *
 * const mask = createMask();
 * mask.use(custom([
 *   {
 *     name: 'uuid',
 *     pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
 *     strategy: 'full'
 *   },
 *   {
 *     name: 'api-key',
 *     pattern: /api[_-]?key["']?\s*[:=]\s*["']?([^"'\s,}]+)/gi,
 *     strategy: 'first',
 *     show: 4
 *   }
 * ]));
 *
 * mask.uuid("123e4567-e89b-12d3-a456-426614174000");
 * // → "************************-********-****-****-************"
 * ```
 */
export function custom(patterns: CustomPatternConfig[]): MaskPlugin {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    throw new InvalidValueError('Patterns must be a non-empty array');
  }

  return {
    name: 'custom',
    version: '1.0.0',
    install(kernel) {
      // Register a masker for each pattern
      for (const pattern of patterns) {
        const masker = createCustomMasker(pattern);
        kernel.registerMasker(pattern.name, masker);
      }
    },
    onInit(context) {
      // Store patterns in context
      (context as Record<string, unknown>).customPatterns = patterns;
    },
  };
}

/**
 * Create a single custom masker without registering a plugin.
 *
 * @param config - Pattern configuration
 * @returns The masker function
 *
 * @example
 * ```typescript
 * import { createCustomMasker } from '@oxog/mask/plugins/custom';
 *
 * const uuidMasker = createCustomMasker({
 *   name: 'uuid',
 *   pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
 *   strategy: 'full'
 * });
 *
 * uuidMasker("123e4567-e89b-12d3-a456-426614174000");
 * // → "************************-********-****-****-************"
 * ```
 */
export function createCustomMaskerFunction(config: CustomPatternConfig) {
  return createCustomMasker(config);
}

/**
 * Common regex patterns for quick use.
 */
export const COMMON_PATTERNS = {
  /** UUID pattern */
  UUID: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,

  /** API Key pattern */
  API_KEY: /api[_-]?key["']?\s*[:=]\s*["']?([^"'\s,}]+)/gi,

  /** Secret pattern */
  SECRET: /secret["']?\s*[:=]\s*["']?([^"'\s,}]+)/gi,

  /** Password pattern */
  PASSWORD: /password["']?\s*[:=]\s*["']?([^"'\s,}]+)/gi,

  /** Token pattern */
  TOKEN: /token["']?\s*[:=]\s*["']?([^"'\s,}]+)/gi,

  /** Base64 pattern */
  BASE64: /[A-Za-z0-9+/]{20,}={0,2}/g,

  /** Hex pattern */
  HEX: /[0-9A-Fa-f]{20,}/g,

  /** MAC Address pattern */
  MAC_ADDRESS: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g,
};

/**
 * Quick custom plugin creators for common patterns.
 */
export const quickCustom = {
  /**
   * Create a UUID masker plugin.
   */
  uuid(): MaskPlugin {
    return custom([
      {
        name: 'uuid',
        pattern: COMMON_PATTERNS.UUID,
        strategy: 'full',
      },
    ]);
  },

  /**
   * Create an API key masker plugin.
   */
  apiKey(): MaskPlugin {
    return custom([
      {
        name: 'api-key',
        pattern: COMMON_PATTERNS.API_KEY,
        strategy: 'first',
        show: 4,
      },
    ]);
  },

  /**
   * Create a secret masker plugin.
   */
  secret(): MaskPlugin {
    return custom([
      {
        name: 'secret',
        pattern: COMMON_PATTERNS.SECRET,
        strategy: 'first',
        show: 4,
      },
    ]);
  },

  /**
   * Create a password masker plugin.
   */
  password(): MaskPlugin {
    return custom([
      {
        name: 'password',
        pattern: COMMON_PATTERNS.PASSWORD,
        strategy: 'full',
      },
    ]);
  },

  /**
   * Create a token masker plugin.
   */
  token(): MaskPlugin {
    return custom([
      {
        name: 'token',
        pattern: COMMON_PATTERNS.TOKEN,
        strategy: 'first',
        show: 4,
      },
    ]);
  },

  /**
   * Create a MAC address masker plugin.
   */
  macAddress(): MaskPlugin {
    return custom([
      {
        name: 'mac',
        pattern: COMMON_PATTERNS.MAC_ADDRESS,
        strategy: 'first',
        show: 2,
        char: '*',
      },
    ]);
  },
};
