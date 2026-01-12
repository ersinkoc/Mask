/**
 * Tests for string utilities
 */

import { describe, it, expect } from 'vitest';
import {
  isString,
  pad,
  truncate,
  repeat,
  byteLength,
  escapeRegex,
  startsWith,
  endsWith,
  between,
  countOccurrences,
  reverse,
  capitalize,
  titleCase,
} from '../../../src/utils/string';

describe('String Utilities', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(true)).toBe(false);
    });
  });

  describe('pad', () => {
    it('should pad strings to the right', () => {
      expect(pad('123', 5, '0')).toBe('12300');
      expect(pad('123', 5)).toBe('123  ');
      expect(pad('123', 3)).toBe('123');
    });

    it('should handle edge cases', () => {
      expect(pad('123', 0)).toBe('123');
      expect(pad('', 5, '*')).toBe('*****');
      expect(pad('12345', 3)).toBe('12345');
    });
  });

  describe('truncate', () => {
    it('should truncate strings longer than max length', () => {
      expect(truncate('hello world', 5)).toBe('he...');
      expect(truncate('hello world', 4, '…')).toBe('hel…');
    });

    it('should return original string if shorter than max length', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should handle edge cases', () => {
      expect(truncate('', 5)).toBe('');
      expect(truncate('hello', 0)).toBe('');
      expect(truncate('hello', 2)).toBe('he');
    });
  });

  describe('repeat', () => {
    it('should repeat characters', () => {
      expect(repeat('*', 5)).toBe('*****');
      expect(repeat('ab', 3)).toBe('ababab');
      expect(repeat('*', 0)).toBe('');
    });

    it('should handle edge cases', () => {
      expect(repeat('*', -1)).toBe('');
      expect(repeat('', 5)).toBe('');
    });
  });

  describe('byteLength', () => {
    it('should calculate byte length correctly', () => {
      expect(byteLength('hello')).toBe(5);
      expect(byteLength('héllo')).toBe(6);
      expect(byteLength('')).toBe(0);
    });

    it('should handle emojis', () => {
      expect(byteLength('😀')).toBe(4);
      expect(byteLength('hello😀')).toBe(9);
    });
  });

  describe('escapeRegex', () => {
    it('should escape special regex characters', () => {
      expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c');
      expect(escapeRegex('[a-z]+')).toBe('\\[a-z\\]\\+');
    });
  });

  describe('startsWith', () => {
    it('should check if string starts with prefix', () => {
      expect(startsWith('hello world', 'hello')).toBe(true);
      expect(startsWith('hello world', 'world')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(startsWith('', '')).toBe(true);
      expect(startsWith('hello', '')).toBe(true);
      expect(startsWith('', 'hello')).toBe(false);
    });
  });

  describe('endsWith', () => {
    it('should check if string ends with suffix', () => {
      expect(endsWith('hello world', 'world')).toBe(true);
      expect(endsWith('hello world', 'hello')).toBe(false);
    });
  });

  describe('between', () => {
    it('should extract substring between markers', () => {
      expect(between('prefix[content]suffix', '[', ']')).toBe('content');
      expect(between('a(test)b', '(', ')')).toBe('test');
    });

    it('should return null if markers not found', () => {
      expect(between('prefix]suffix', '[', ']')).toBeNull();
      expect(between('prefix[suffix', '[', ']')).toBeNull();
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of substring', () => {
      expect(countOccurrences('hello world', 'l')).toBe(3);
      expect(countOccurrences('hello world', 'x')).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(countOccurrences('hello', '')).toBe(0);
      expect(countOccurrences('', 'l')).toBe(0);
    });
  });

  describe('reverse', () => {
    it('should reverse strings', () => {
      expect(reverse('hello')).toBe('olleh');
      expect(reverse('')).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('HELLO');
      expect(capitalize('')).toBe('');
    });
  });

  describe('titleCase', () => {
    it('should convert to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('foo-bar')).toBe('Foo Bar');
      expect(titleCase('FOO_BAR')).toBe('Foo Bar');
    });
  });
});
