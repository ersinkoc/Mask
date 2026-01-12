/**
 * Tests for masking strategies
 */

import { describe, it, expect } from 'vitest';
import {
  applyStrategy,
  isValidStrategy,
  getStrategies,
  getVisibleCount,
  getMaskedCount,
} from '../../src/strategies';
import { InvalidStrategyError } from '../../src/errors';

describe('Masking Strategies', () => {
  describe('applyStrategy', () => {
    describe('full strategy', () => {
      it('should mask all characters', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'full', '*')).toBe('**********');
        expect(applyStrategy('test', 'full', '*')).toBe('****');
        expect(applyStrategy('', 'full', '*')).toBe('');
      });

      it('should work with different masking characters', () => {
        expect(applyStrategy('test', 'full', '•')).toBe('••••');
        expect(applyStrategy('test', 'full', 'X')).toBe('XXXX');
      });
    });

    describe('middle strategy', () => {
      it('should show first and last characters', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'middle', '*')).toBe('A********J');
        expect(applyStrategy('test', 'middle', '*')).toBe('t**t');
        expect(applyStrategy('ab', 'middle', '*')).toBe('**');
        expect(applyStrategy('a', 'middle', '*')).toBe('*');
        expect(applyStrategy('', 'middle', '*')).toBe('');
      });
    });

    describe('first:N strategy', () => {
      it('should show first N characters', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'first:3', '*')).toBe('ABC*******');
        expect(applyStrategy('test', 'first:2', '*')).toBe('te**');
        expect(applyStrategy('ABC', 'first:5', '*')).toBe('ABC'); // Not enough chars
      });

      it('should handle first:0', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'first:0', '*')).toBe('**********');
      });
    });

    describe('last:N strategy', () => {
      it('should show last N characters', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'last:4', '*')).toBe('******GHIJ');
        expect(applyStrategy('test', 'last:2', '*')).toBe('**st');
      });

      it('should handle last:0', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'last:0', '*')).toBe('**********');
      });
    });

    describe('partial:N strategy', () => {
      it('should show percentage of characters', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'partial:0.5', '*')).toBe('ABCDE*****');
        expect(applyStrategy('test', 'partial:0.5', '*')).toBe('te**');
        expect(applyStrategy('ABCDEFGHIJ', 'partial:0.3', '*')).toBe('ABC*******');
      });

      it('should handle partial:0', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'partial:0', '*')).toBe('**********');
      });

      it('should handle partial:1', () => {
        expect(applyStrategy('ABCDEFGHIJ', 'partial:1', '*')).toBe('ABCDEFGHIJ');
      });
    });

    it('should throw error for invalid strategy', () => {
      expect(() => applyStrategy('test', 'invalid' as any, '*')).toThrow(InvalidStrategyError);
    });

    it('should handle empty string', () => {
      expect(applyStrategy('', 'full', '*')).toBe('');
      expect(applyStrategy('', 'middle', '*')).toBe('');
    });
  });

  describe('isValidStrategy', () => {
    it('should return true for valid strategies', () => {
      expect(isValidStrategy('full')).toBe(true);
      expect(isValidStrategy('middle')).toBe(true);
      expect(isValidStrategy('first:3')).toBe(true);
      expect(isValidStrategy('last:4')).toBe(true);
      expect(isValidStrategy('partial:0.5')).toBe(true);
      expect(isValidStrategy('first:0')).toBe(true);
      expect(isValidStrategy('last:0')).toBe(true);
      expect(isValidStrategy('partial:0')).toBe(true);
      expect(isValidStrategy('partial:1')).toBe(true);
    });

    it('should return false for invalid strategies', () => {
      expect(isValidStrategy('invalid')).toBe(false);
      expect(isValidStrategy('first')).toBe(false);
      expect(isValidStrategy('last')).toBe(false);
      expect(isValidStrategy('partial')).toBe(false);
      expect(isValidStrategy('first:abc')).toBe(false);
      expect(isValidStrategy('last:-1')).toBe(false);
      expect(isValidStrategy('partial:2')).toBe(false);
    });
  });

  describe('getStrategies', () => {
    it('should return array of strategy names', () => {
      const strategies = getStrategies();
      expect(strategies).toContain('full');
      expect(strategies).toContain('middle');
      expect(Array.isArray(strategies)).toBe(true);
    });
  });

  describe('getVisibleCount', () => {
    it('should return correct count of visible characters', () => {
      expect(getVisibleCount('ABCDEFGHIJ', 'full')).toBe(0);
      expect(getVisibleCount('ABCDEFGHIJ', 'middle')).toBe(2);
      expect(getVisibleCount('ABCDEFGHIJ', 'first:3')).toBe(3);
      expect(getVisibleCount('ABCDEFGHIJ', 'last:4')).toBe(4);
      expect(getVisibleCount('ABCDEFGHIJ', 'partial:0.5')).toBe(5);
      expect(getVisibleCount('A', 'middle')).toBe(1);
      expect(getVisibleCount('AB', 'middle')).toBe(2);
    });

    it('should handle edge cases', () => {
      expect(getVisibleCount('', 'full')).toBe(0);
      expect(getVisibleCount('ABC', 'first:10')).toBe(3);
      expect(getVisibleCount('ABC', 'last:10')).toBe(3);
    });
  });

  describe('getMaskedCount', () => {
    it('should return correct count of masked characters', () => {
      expect(getMaskedCount('ABCDEFGHIJ', 'full')).toBe(10);
      expect(getMaskedCount('ABCDEFGHIJ', 'middle')).toBe(8);
      expect(getMaskedCount('ABCDEFGHIJ', 'first:3')).toBe(7);
      expect(getMaskedCount('ABCDEFGHIJ', 'last:4')).toBe(6);
      expect(getMaskedCount('ABCDEFGHIJ', 'partial:0.5')).toBe(5);
    });

    it('should verify masked + visible = total', () => {
      const value = 'ABCDEFGHIJ';
      const total = value.length;
      const strategies: any[] = ['full', 'middle', 'first:3', 'last:4', 'partial:0.5'];

      for (const strategy of strategies) {
        const visible = getVisibleCount(value, strategy);
        const masked = getMaskedCount(value, strategy);
        expect(visible + masked).toBe(total);
      }
    });
  });
});
