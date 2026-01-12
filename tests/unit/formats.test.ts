/**
 * Tests for formatting
 */

import { describe, it, expect } from 'vitest';
import {
  applyFormat,
  isValidFormat,
  getFormats,
  getDefaultFormat,
  isFormatSuitable,
  formatForDisplay,
  formatForStorage,
  formatForLogging,
} from '../../src/formats';
import { InvalidFormatError } from '../../src/errors';

describe('Formatting', () => {
  describe('applyFormat', () => {
    describe('display format', () => {
      it('should format card numbers with spaces', () => {
        expect(applyFormat('************0366', 'card', 'display')).toBe('**** **** **** 0366');
        expect(applyFormat('************4444', 'card', 'display')).toBe('**** **** **** 4444');
      });

      it('should format phone numbers', () => {
        expect(applyFormat('+90*****4567', 'phone', 'display')).toBe('+90*****4567');
        expect(applyFormat('***-***-1234567890', 'phone', 'display')).toBe('(123) 456-7890');
      });

      it('should format IBAN with spaces', () => {
        expect(applyFormat('TR33••••••••••••••1326', 'iban', 'display')).toBe('TR33 •••• •••• •••• ••13 26');
      });

      it('should keep other types unchanged', () => {
        expect(applyFormat('t***t@e***.com', 'email', 'display')).toBe('t***t@e***.com');
      });
    });

    describe('compact format', () => {
      it('should remove all spaces', () => {
        expect(applyFormat('**** **** **** 0366', 'card', 'compact')).toBe('************0366');
        expect(applyFormat('t***t@e***.com', 'email', 'compact')).toBe('t***t@e***.com');
      });
    });

    describe('log format', () => {
      it('should return redacted placeholder', () => {
        expect(applyFormat('**** **** **** 0366', 'card', 'log')).toBe('[REDACTED:card]');
        expect(applyFormat('t***t@e***.com', 'email', 'log')).toBe('[REDACTED:email]');
        expect(applyFormat('anything', 'anytype', 'log')).toBe('[REDACTED:anytype]');
      });
    });

    it('should throw error for invalid format', () => {
      expect(() => applyFormat('test', 'card', 'invalid' as any)).toThrow(InvalidFormatError);
    });
  });

  describe('isValidFormat', () => {
    it('should return true for valid formats', () => {
      expect(isValidFormat('display')).toBe(true);
      expect(isValidFormat('compact')).toBe(true);
      expect(isValidFormat('log')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(isValidFormat('invalid')).toBe(false);
      expect(isValidFormat('custom')).toBe(false);
    });
  });

  describe('getFormats', () => {
    it('should return array of format names', () => {
      const formats = getFormats();
      expect(formats).toContain('display');
      expect(formats).toContain('compact');
      expect(formats).toContain('log');
      expect(Array.isArray(formats)).toBe(true);
    });
  });

  describe('getDefaultFormat', () => {
    it('should return display as default for all types', () => {
      expect(getDefaultFormat('card')).toBe('display');
      expect(getDefaultFormat('email')).toBe('display');
      expect(getDefaultFormat('phone')).toBe('display');
    });
  });

  describe('isFormatSuitable', () => {
    it('should return true for all format-type combinations', () => {
      expect(isFormatSuitable('display', 'card')).toBe(true);
      expect(isFormatSuitable('compact', 'email')).toBe(true);
      expect(isFormatSuitable('log', 'phone')).toBe(true);
    });
  });

  describe('formatForDisplay', () => {
    it('should apply display format', () => {
      expect(formatForDisplay('************0366', 'card')).toBe('**** **** **** 0366');
    });
  });

  describe('formatForStorage', () => {
    it('should apply compact format', () => {
      expect(formatForStorage('**** **** **** 0366', 'card')).toBe('************0366');
    });
  });

  describe('formatForLogging', () => {
    it('should apply log format', () => {
      expect(formatForLogging('t***t@e***.com', 'email')).toBe('[REDACTED:email]');
    });
  });
});
