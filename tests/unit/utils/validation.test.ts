/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidCard,
  isValidIBAN,
  isValidIP,
  isValidIPv6,
  isValidURL,
  isValidSSN,
  isValidJWT,
  isValidHexColor,
} from '../../../src/utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user@domain.org')).toBe(true);
      expect(isValidEmail('name.surname@company.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingdomain.com')).toBe(false);
      expect(isValidEmail('missing-at-sign.net')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('+905551234567')).toBe(true);
      expect(isValidPhone('+1-555-123-4567')).toBe(true);
      expect(isValidPhone('555-123-4567')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('+')).toBe(false);
    });
  });

  describe('isValidCard', () => {
    it('should validate correct card numbers', () => {
      expect(isValidCard('4532015112830366')).toBe(true); // Visa
      expect(isValidCard('5555555555554444')).toBe(true); // Mastercard
      expect(isValidCard('4012888888881881')).toBe(true); // Visa
    });

    it('should reject invalid card numbers', () => {
      expect(isValidCard('1234567890123456')).toBe(false); // Fails Luhn
      expect(isValidCard('')).toBe(false);
      expect(isValidCard('123')).toBe(false);
      expect(isValidCard('abcd1234')).toBe(false);
    });
  });

  describe('isValidIBAN', () => {
    it('should validate correct IBANs', () => {
      expect(isValidIBAN('TR330006100519786457841326')).toBe(true);
      expect(isValidIBAN('GB29 NWBK 6016 1331 9268 19')).toBe(true);
      expect(isValidIBAN('DE89370400440532013000')).toBe(true);
    });

    it('should reject invalid IBANs', () => {
      expect(isValidIBAN('INVALID')).toBe(false);
      expect(isValidIBAN('')).toBe(false);
      expect(isValidIBAN('123')).toBe(false);
    });
  });

  describe('isValidIP', () => {
    it('should validate correct IPv4 addresses', () => {
      expect(isValidIP('192.168.1.1')).toBe(true);
      expect(isValidIP('255.255.255.255')).toBe(true);
      expect(isValidIP('0.0.0.0')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(isValidIP('256.1.1.1')).toBe(false); // Out of range
      expect(isValidIP('192.168.1')).toBe(false); // Incomplete
      expect(isValidIP('192.168.1.1.1')).toBe(false); // Too many octets
      expect(isValidIP('abc.def.ghi.jkl')).toBe(false); // Non-numeric
      expect(isValidIP('192.168.01.1')).toBe(false); // Leading zero
    });
  });

  describe('isValidIPv6', () => {
    it('should validate correct IPv6 addresses', () => {
      expect(isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isValidIPv6('::1')).toBe(true); // Loopback
      expect(isValidIPv6('::')).toBe(true); // All zeros
      expect(isValidIPv6('2001:db8::1')).toBe(true); // Compressed
    });

    it('should reject invalid IPv6 addresses', () => {
      expect(isValidIPv6('invalid')).toBe(false);
      expect(isValidIPv6('192.168.1.1')).toBe(false); // IPv4
      expect(isValidIPv6(':::')).toBe(false); // Multiple compression
      expect(isValidIPv6('2001:db8:::1')).toBe(false); // Multiple compression
    });
  });

  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://example.com/path')).toBe(true);
      expect(isValidURL('https://example.com:8080')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('isValidSSN', () => {
    it('should validate correct SSNs', () => {
      expect(isValidSSN('123-45-6789')).toBe(true);
      expect(isValidSSN('123456789')).toBe(true);
    });

    it('should reject invalid SSNs', () => {
      expect(isValidSSN('000-00-0000')).toBe(false); // All zeros
      expect(isValidSSN('666-12-3456')).toBe(false); // Invalid area
      expect(isValidSSN('900-12-3456')).toBe(false); // Invalid area
      expect(isValidSSN('123-00-3456')).toBe(false); // Invalid group
      expect(isValidSSN('123-45-0000')).toBe(false); // Invalid serial
      expect(isValidSSN('1234567890')).toBe(false); // Too long
    });
  });

  describe('isValidJWT', () => {
    it('should validate correct JWTs', () => {
      const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      expect(isValidJWT(validJWT)).toBe(true);
    });

    it('should reject invalid JWTs', () => {
      expect(isValidJWT('not-a-jwt')).toBe(false);
      expect(isValidJWT('header.payload')).toBe(false); // Missing signature
      expect(isValidJWT('invalid.base64!')).toBe(false); // Invalid base64
      expect(isValidJWT('')).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate correct hex colors', () => {
      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#ABC')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('red')).toBe(false);
      expect(isValidHexColor('#FF00')).toBe(false); // Invalid length
      expect(isValidHexColor('#FF00GG')).toBe(false); // Invalid characters
      expect(isValidHexColor('')).toBe(false);
    });
  });
});
