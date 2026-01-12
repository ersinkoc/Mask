/**
 * @oxog/mask - Masking Strategies
 *
 * Implementation of various masking strategies for data obfuscation.
 */

import type { MaskStrategy, StrategyHandler } from './types';
import { InvalidStrategyError } from './errors';
import { repeat } from './utils/string';

/**
 * Apply a masking strategy to a value.
 *
 * @param value - The value to mask
 * @param strategy - The strategy to apply
 * @param char - The character to use for masking
 * @returns The masked value
 *
 * @example
 * ```typescript
 * applyStrategy("ABCDEFGHIJ", 'first:3', '*');  // → "ABC*******"
 * applyStrategy("ABCDEFGHIJ", 'last:4', '*');   // → "******GHIJ"
 * applyStrategy("ABCDEFGHIJ", 'middle', '*');    // → "A********J"
 * ```
 */
export function applyStrategy(
  value: string,
  strategy: MaskStrategy,
  char: string = '*'
): string {
  if (value.length === 0) {
    return value;
  }

  // Extract strategy name (e.g., 'last:4' -> 'last')
  const strategyName = strategy.split(':')[0] || strategy;
  const handler = (strategies as any)[strategyName];

  if (!handler) {
    throw new InvalidStrategyError(strategy);
  }

  return handler(value, strategy, char);
}

/**
 * Validate a strategy value.
 *
 * @param strategy - The strategy to validate
 * @returns True if the strategy is valid
 *
 * @example
 * ```typescript
 * isValidStrategy('full');        // → true
 * isValidStrategy('first:3');     // → true
 * isValidStrategy('invalid');     // → false
 * ```
 */
export function isValidStrategy(strategy: string): strategy is MaskStrategy {
  if (strategy === 'full' || strategy === 'middle') {
    return true;
  }

  if (strategy.startsWith('first:')) {
    const n = parseInt(strategy.split(':')[1] || '0', 10);
    return !isNaN(n) && n >= 0;
  }

  if (strategy.startsWith('last:')) {
    const n = parseInt(strategy.split(':')[1] || '0', 10);
    return !isNaN(n) && n >= 0;
  }

  if (strategy.startsWith('partial:')) {
    const ratio = parseFloat(strategy.split(':')[1] || '0');
    return !isNaN(ratio) && ratio >= 0 && ratio <= 1;
  }

  return false;
}

/**
 * Get all available strategies.
 *
 * @returns Array of strategy names
 *
 * @example
 * ```typescript
 * getStrategies();
 * // → ['full', 'middle', 'first:0', 'last:0', 'partial:0']
 * ```
 */
export function getStrategies(): string[] {
  return ['full', 'middle', 'first:0', 'last:0', 'partial:0'];
}

/**
 * Strategy handler implementations.
 * Each strategy masks different parts of the value.
 */
const strategies: Record<string, StrategyHandler> = {
  /**
   * Mask everything - replace entire string with masking character.
   */
  full: (value: string, _strategy: any, char: string): string => {
    return repeat(char, value.length);
  },

  /**
   * Show first and last characters, mask the middle.
   * For strings with 2 or fewer characters, masks everything.
   */
  middle: (value: string, _strategy: any, char: string): string => {
    if (value.length <= 2) {
      return repeat(char, value.length);
    }

    const first = value[0];
    const last = value[value.length - 1];
    const middleLength = value.length - 2;
    const middle = repeat(char, middleLength);

    return first + middle + last;
  },

  /**
   * Show first N characters, mask the rest.
   */
  first: (value: string, strategy: any, char: string): string => {
    const n = parseInt(strategy.split(':')[1], 10);

    if (n <= 0) {
      return repeat(char, value.length);
    }

    if (n >= value.length) {
      return value;
    }

    const visible = value.substring(0, n);
    const masked = repeat(char, value.length - n);

    return visible + masked;
  },

  /**
   * Show last N characters, mask the rest.
   */
  last: (value: string, strategy: any, char: string): string => {
    const n = parseInt(strategy.split(':')[1], 10);

    if (n <= 0) {
      return repeat(char, value.length);
    }

    if (n >= value.length) {
      return value;
    }

    const masked = repeat(char, value.length - n);
    const visible = value.substring(value.length - n);

    return masked + visible;
  },

  /**
   * Show a percentage of the value, mask the rest.
   * Ratio should be between 0 and 1.
   */
  partial: (value: string, strategy: any, char: string): string => {
    const ratio = parseFloat(strategy.split(':')[1]);

    if (ratio <= 0) {
      return repeat(char, value.length);
    }

    if (ratio >= 1) {
      return value;
    }

    const visible = Math.floor(value.length * ratio);
    const masked = repeat(char, value.length - visible);

    return value.substring(0, visible) + masked;
  },
};

/**
 * Get the number of visible characters for a strategy.
 *
 * @param value - The value to analyze
 * @param strategy - The strategy to analyze
 * @returns Number of visible characters
 *
 * @example
 * ```typescript
 * getVisibleCount("ABCDEFGHIJ", 'first:3');   // → 3
 * getVisibleCount("ABCDEFGHIJ", 'last:4');    // → 4
 * getVisibleCount("ABCDEFGHIJ", 'middle');    // → 2
 * ```
 */
export function getVisibleCount(value: string, strategy: MaskStrategy): number {
  if (value.length === 0) {
    return 0;
  }

  switch (strategy) {
    case 'full':
      return 0;

    case 'middle':
      return Math.min(2, value.length);

    case 'first:0':
      return 0;

    case 'last:0':
      return 0;

    case 'partial:0':
      return 0;

    default:
      if (strategy.startsWith('first:')) {
        const n = parseInt(strategy.split(':')[1] || '0', 10);
        return Math.min(n, value.length);
      }

      if (strategy.startsWith('last:')) {
        const n = parseInt(strategy.split(':')[1] || '0', 10);
        return Math.min(n, value.length);
      }

      if (strategy.startsWith('partial:')) {
        const ratio = parseFloat(strategy.split(':')[1] || '0');
        return Math.floor(value.length * ratio);
      }

      return 0;
  }
}

/**
 * Get the number of masked characters for a strategy.
 *
 * @param value - The value to analyze
 * @param strategy - The strategy to analyze
 * @returns Number of masked characters
 *
 * @example
 * ```typescript
 * getMaskedCount("ABCDEFGHIJ", 'first:3');   // → 7
 * getMaskedCount("ABCDEFGHIJ", 'last:4');    // → 6
 * getMaskedCount("ABCDEFGHIJ", 'middle');    // → 8
 * ```
 */
export function getMaskedCount(value: string, strategy: MaskStrategy): number {
  if (value.length === 0) {
    return 0;
  }

  return value.length - getVisibleCount(value, strategy);
}
