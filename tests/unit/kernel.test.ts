/**
 * Tests for kernel
 */

import { describe, it, expect } from 'vitest';
import { MaskKernel } from '../../src/kernel';
import { email } from '../../src/plugins/core/email';
import { phone } from '../../src/plugins/core/phone';
import { card } from '../../src/plugins/core/card';
import { PluginRegistrationError, PluginNotFoundError, MaskerNotFoundError } from '../../src/errors';

describe('Mask Kernel', () => {
  it('should create kernel instance', () => {
    const kernel = new MaskKernel();
    expect(kernel).toBeDefined();
    expect(kernel.getPluginCount()).toBe(0);
    expect(kernel.getMaskerCount()).toBe(0);
  });

  it('should register and unregister plugins', () => {
    const kernel = new MaskKernel();

    // Register email plugin
    const emailPlugin = email();
    kernel.registerPlugin(emailPlugin);
    expect(kernel.hasPlugin('email')).toBe(true);
    expect(kernel.getPluginCount()).toBe(1);

    // Unregister plugin
    const result = kernel.unregisterPlugin('email');
    expect(result).toBe(true);
    expect(kernel.hasPlugin('email')).toBe(false);
    expect(kernel.getPluginCount()).toBe(0);

    // Try to unregister non-existent plugin
    const result2 = kernel.unregisterPlugin('nonexistent');
    expect(result2).toBe(false);
  });

  it('should register maskers', () => {
    const kernel = new MaskKernel();

    const masker = (value: string) => value;
    kernel.registerMasker('test', masker);

    expect(kernel.hasMasker('test')).toBe(true);
    expect(kernel.getMasker('test')).toBe(masker);
    expect(kernel.getMaskerCount()).toBe(1);
  });

  it('should execute maskers', () => {
    const kernel = new MaskKernel();

    const masker = (value: string) => value.toUpperCase();
    kernel.registerMasker('upper', masker);

    const result = kernel.executeMask('upper', 'hello');
    expect(result).toBe('HELLO');
  });

  it('should throw error for unregistered masker', () => {
    const kernel = new MaskKernel();
    expect(() => kernel.executeMask('nonexistent', 'test')).toThrow(MaskerNotFoundError);
  });

  it('should list plugins', () => {
    const kernel = new MaskKernel();

    kernel.registerPlugin(email());
    kernel.registerPlugin(phone());
    kernel.registerPlugin(card());

    const plugins = kernel.listPlugins();
    expect(plugins).toContain('email');
    expect(plugins).toContain('phone');
    expect(plugins).toContain('card');
    expect(plugins).toHaveLength(3);
  });

  it('should prevent duplicate plugin registration', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());

    expect(() => kernel.registerPlugin(email())).toThrow(PluginRegistrationError);
  });

  it('should validate plugin registration', () => {
    const kernel = new MaskKernel();

    expect(() => kernel.registerPlugin({} as any)).toThrow(PluginRegistrationError);
    expect(() => kernel.registerPlugin({ name: 'test' } as any)).toThrow(PluginRegistrationError);
    expect(() => kernel.registerPlugin({ name: 'test', version: '1.0.0' } as any)).toThrow(PluginRegistrationError);
  });

  it('should get plugin state', async () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());
    await kernel.initialize();

    const state = kernel.getState();
    expect(state.pluginCount).toBe(1);
    expect(state.maskerCount).toBe(1);
    expect(state.plugins).toContain('email');
    expect(state.maskers).toContain('email');
    expect(state.initialized).toBe(true);
  });

  it('should reset kernel', () => {
    const kernel = new MaskKernel();
    kernel.registerPlugin(email());
    kernel.registerPlugin(phone());

    expect(kernel.getPluginCount()).toBe(2);

    kernel.reset();

    expect(kernel.getPluginCount()).toBe(0);
    expect(kernel.getMaskerCount()).toBe(0);
  });
});
