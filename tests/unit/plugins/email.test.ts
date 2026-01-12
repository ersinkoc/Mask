/**
 * Tests for email plugin
 */

import { describe, it, expect } from 'vitest';
import { email, maskEmailFunction } from '../../../src/plugins/core/email';
import { MaskKernel } from '../../../src/kernel';
import { InvalidValueError } from '../../../src/errors';
import { validEmails, invalidEmails, emailMaskingTestCases } from '../../../tests/fixtures/emails';

describe('Email Plugin', () => {
  it('should create email plugin', () => {
    const plugin = email();
    expect(plugin.name).toBe('email');
    expect(plugin.version).toBe('1.0.0');
    expect(typeof plugin.install).toBe('function');
  });

  it('should register email masker in kernel', () => {
    const kernel = new MaskKernel();
    const plugin = email();
    kernel.registerPlugin(plugin);

    expect(kernel.hasMasker('email')).toBe(true);
  });

  it('should mask email addresses correctly', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    for (const emailAddr of validEmails) {
      const result = kernel.executeMask('email', emailAddr);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('should use default strategy (middle)', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    const result = kernel.executeMask('email', 'test@example.com');
    expect(result).toBe('t**t@example.com');
  });

  it('should use custom strategy', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    const result = kernel.executeMask('email', 'test@example.com', {
      strategy: 'full',
    });
    expect(result).toBe('****@example.com');
  });

  it('should use custom masking character', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    const result = kernel.executeMask('email', 'test@example.com', {
      char: '•',
    });
    expect(result).toBe('t••t@example.com');
  });

  it('should apply different formats', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    const displayResult = kernel.executeMask('email', 'test@example.com', {
      format: 'display',
    });
    expect(displayResult).toBe('t**t@example.com');

    const logResult = kernel.executeMask('email', 'test@example.com', {
      format: 'log',
    });
    expect(logResult).toBe('[REDACTED:email]');
  });

  it('should throw error for invalid email', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    for (const invalidEmail of invalidEmails) {
      expect(() => kernel.executeMask('email', invalidEmail)).toThrow(InvalidValueError);
    }
  });

  it('should throw error for non-string input', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    expect(() => kernel.executeMask('email', 123 as any)).toThrow(InvalidValueError);
    expect(() => kernel.executeMask('email', null as any)).toThrow(InvalidValueError);
  });

  it('should handle edge cases', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    // Very short email
    expect(kernel.executeMask('email', 'a@b.co')).toBeDefined();

    // Email with plus
    expect(kernel.executeMask('email', 'test+tag@example.com')).toBeDefined();
  });

  it('should use masker function directly', () => {
    const result = maskEmailFunction('test@example.com');
    expect(result).toBe('t**t@example.com');
  });

  describe('Email Masking Test Cases', () => {
    it('should mask according to test cases', () => {
      const kernel = new MaskKernel();
      kernel.registerPlugin(email());

      for (const testCase of emailMaskingTestCases) {
        // Default
        const defaultResult = kernel.executeMask('email', testCase.input);
        expect(defaultResult).toBe(testCase.expected.default);

        // Full
        const fullResult = kernel.executeMask('email', testCase.input, { strategy: 'full' });
        expect(fullResult).toBe(testCase.expected.full);

        // Middle
        const middleResult = kernel.executeMask('email', testCase.input, { strategy: 'middle' });
        expect(middleResult).toBe(testCase.expected.middle);

        // Log format
        const logResult = kernel.executeMask('email', testCase.input, { format: 'log' });
        expect(logResult).toBe(testCase.expected.log);
      }
    });
  });
});
