/**
 * @oxog/mask - Error Classes
 *
 * Custom error classes for the @oxog/mask package.
 * All errors extend the base MaskError class and include error codes and context.
 */

import type { ErrorContext } from './types';

/**
 * Base error class for all mask errors.
 *
 * @example
 * ```typescript
 * throw new MaskError('Invalid input', 'INVALID_VALUE', { value: input });
 * ```
 */
export class MaskError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MaskError';
    this.code = code;
    this.context = context;
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Convert error to JSON for serialization.
   */
  toJSON(): ErrorContext {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Error thrown when input validation fails.
 *
 * @example
 * ```typescript
 * throw new InvalidValueError('Value must be a string', { value: 123 });
 * ```
 */
export class InvalidValueError extends MaskError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_VALUE', context);
    this.name = 'InvalidValueError';
  }
}

/**
 * Error thrown when an invalid strategy is specified.
 *
 * @example
 * ```typescript
 * throw new InvalidStrategyError('invalid-strategy');
 * ```
 */
export class InvalidStrategyError extends MaskError {
  constructor(strategy: string) {
    super(`Invalid masking strategy: ${strategy}`, 'INVALID_STRATEGY', { strategy });
    this.name = 'InvalidStrategyError';
  }
}

/**
 * Error thrown when an invalid format is specified.
 *
 * @example
 * ```typescript
 * throw new InvalidFormatError('invalid-format');
 * ```
 */
export class InvalidFormatError extends MaskError {
  constructor(format: string) {
    super(`Invalid masking format: ${format}`, 'INVALID_FORMAT', { format });
    this.name = 'InvalidFormatError';
  }
}

/**
 * Error thrown when a plugin operation fails.
 *
 * @example
 * ```typescript
 * throw new PluginError('Failed to install plugin', 'my-plugin');
 * ```
 */
export class PluginError extends MaskError {
  constructor(
    message: string,
    public readonly pluginName: string,
    context?: Record<string, unknown>
  ) {
    super(message, 'PLUGIN_ERROR', { ...context, pluginName });
    this.name = 'PluginError';
  }
}

/**
 * Error thrown when a required plugin is not found.
 *
 * @example
 * ```typescript
 * throw new PluginNotFoundError('my-plugin');
 * ```
 */
export class PluginNotFoundError extends MaskError {
  constructor(pluginName: string) {
    super(`Plugin not found: ${pluginName}`, 'PLUGIN_NOT_FOUND', { pluginName });
    this.name = 'PluginNotFoundError';
  }
}

/**
 * Error thrown when a field path is invalid.
 *
 * @example
 * ```typescript
 * throw new InvalidFieldPathError('invalid..path');
 * ```
 */
export class InvalidFieldPathError extends MaskError {
  constructor(path: string) {
    super(`Invalid field path: ${path}`, 'INVALID_FIELD_PATH', { path });
    this.name = 'InvalidFieldPathError';
  }
}

/**
 * Error thrown when circular reference is detected.
 *
 * @example
 * ```typescript
 * throw new CircularReferenceError('object');
 * ```
 */
export class CircularReferenceError extends MaskError {
  constructor(path: string) {
    super(`Circular reference detected at path: ${path}`, 'CIRCULAR_REFERENCE', { path });
    this.name = 'CircularReferenceError';
  }
}

/**
 * Error thrown when a masker type is not found.
 *
 * @example
 * ```typescript
 * throw new MaskerNotFoundError('custom-type');
 * ```
 */
export class MaskerNotFoundError extends MaskError {
  constructor(type: string) {
    super(`Masker not found for type: ${type}`, 'MASKER_NOT_FOUND', { type });
    this.name = 'MaskerNotFoundError';
  }
}

/**
 * Error thrown when plugin registration fails.
 *
 * @example
 * ```typescript
 * throw new PluginRegistrationError('Plugin already registered', 'email');
 * ```
 */
export class PluginRegistrationError extends MaskError {
  constructor(message: string, pluginName: string) {
    super(message, 'PLUGIN_REGISTRATION_ERROR', { pluginName });
    this.name = 'PluginRegistrationError';
  }
}

/**
 * Error thrown when plugin initialization fails.
 *
 * @example
 * ```typescript
 * throw new PluginInitError('Failed to initialize plugin', 'my-plugin');
 * ```
 */
export class PluginInitError extends MaskError {
  constructor(message: string, pluginName: string, cause?: Error) {
    super(message, 'PLUGIN_INIT_ERROR', { pluginName, cause });
    this.name = 'PluginInitError';
    if (cause && this.cause) {
      this.cause = cause;
    }
  }

  public override readonly cause?: Error;
}

/**
 * Error thrown when plugin dependency is not satisfied.
 *
 * @example
 * ```typescript
 * throw new PluginDependencyError('Missing dependency: locale-tr', 'my-plugin');
 * ```
 */
export class PluginDependencyError extends MaskError {
  constructor(message: string, pluginName: string, dependency: string) {
    super(message, 'PLUGIN_DEPENDENCY_ERROR', { pluginName, dependency });
    this.name = 'PluginDependencyError';
  }
}
