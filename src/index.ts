/**
 * @oxog/mask - Main API
 *
 * Zero-dependency data masking with plugin architecture.
 */

import type {
  MaskInstance,
  CreateMask,
  MaskConfig,
  ObjectMaskOptions,
  MaskOptions,
  MaskStrategy,
} from './types';

import { MaskKernel } from './kernel';
import { email } from './plugins/core/email';
import { phone } from './plugins/core/phone';
import { card } from './plugins/core/card';
import { traverse } from './traverser';
import { isValidStrategy } from './strategies';
import { isValidFormat } from './formats';
import { isValidFieldPath } from './traverser';
import { InvalidStrategyError, InvalidFormatError, InvalidFieldPathError } from './errors';

/**
 * Create a mask instance with custom configuration.
 *
 * @param config - Optional configuration
 * @returns A new mask instance
 *
 * @example
 * ```typescript
 * // Create default instance
 * const mask1 = createMask();
 * mask1.email("test@example.com");
 * // → "t***t@e***.com"
 *
 * // Create custom instance
 * const mask2 = createMask({
 *   char: '•',
 *   defaultStrategy: 'middle'
 * });
 * mask2.email("test@example.com");
 * // → "t•••t@e•••.com"
 * ```
 */
export const createMask: CreateMask = (config: MaskConfig = {}): MaskInstance => {
  const kernel = new MaskKernel();

  // Register core plugins
  kernel.registerPlugin(email());
  kernel.registerPlugin(phone());
  kernel.registerPlugin(card());

  // Register optional plugins from config
  if (config.plugins) {
    for (const plugin of config.plugins) {
      kernel.registerPlugin(plugin);
    }
  }

  // Initialize plugins
  kernel.initialize();

  // Create instance with all methods
  const instance: any = {
    email(value: string, options: MaskOptions = {}): string {
      validateOptions(options);
      return kernel.executeMask('email', value, {
        char: config.char,
        ...options,
      });
    },

    phone(value: string, options: MaskOptions = {}): string {
      validateOptions(options);
      return kernel.executeMask('phone', value, {
        char: config.char,
        ...options,
      });
    },

    card(value: string, options: MaskOptions = {}): string {
      validateOptions(options);
      return kernel.executeMask('card', value, {
        char: config.char,
        ...options,
      });
    },

    pattern(value: string, options: MaskOptions & { show?: MaskStrategy } = {}): string {
      validateOptions(options);
      const strategy = options.show || config.defaultStrategy || 'middle';
      const char = options.char || config.char || '*';
      const format = options.format || config.defaultFormat || 'display';

      return kernel.executeMask('pattern', value, {
        strategy,
        char,
        format,
      });
    },

    use(plugin: any) {
      kernel.registerPlugin(plugin);
      kernel.initialize();
      return instance;
    },

    unregister(name: string): boolean {
      return kernel.unregisterPlugin(name);
    },

    list(): string[] {
      return kernel.listPlugins();
    },

    has(name: string): boolean {
      return kernel.hasPlugin(name);
    },

    // Generic masker for any registered type
    executeMask(type: string, value: string, options: MaskOptions = {}): string {
      validateOptions(options);
      return kernel.executeMask(type, value, {
        char: config.char,
        ...options,
      });
    },
  };

  // Add object masking method
  instance.objectMasking = function<T extends object>(obj: T, options: ObjectMaskOptions = {}): T {
    // Validate field paths
    if (options.fields) {
      for (const path of Object.keys(options.fields)) {
        if (!isValidFieldPath(path)) {
          throw new InvalidFieldPathError(path);
        }
      }
    }

    // Validate options
    validateObjectOptions(options);

    // Create traversal context
    const context = {
      kernel,
    };

    // Traverse and mask
    return traverse(obj, {
      deep: true,
      maskArrays: true,
      char: config.char,
      ...options,
    }, context);
  };

  return instance as MaskInstance;
};

/**
 * Default mask instance with core plugins loaded.
 *
 * @example
 * ```typescript
 * import { mask } from '@oxog/mask';
 *
 * mask.email("test@example.com");
 * // → "t***t@e***.com"
 *
 * mask.phone("+905551234567");
 * // → "+90*****4567"
 *
 * mask.card("4532015112830366");
 * // → "**** **** **** 0366"
 * ```
 */
export const mask = createMask();

/**
 * Validate mask options.
 *
 * @param options - Options to validate
 */
function validateOptions(options: MaskOptions): void {
  if (options.strategy && !isValidStrategy(options.strategy)) {
    throw new InvalidStrategyError(options.strategy);
  }

  if (options.format && !isValidFormat(options.format)) {
    throw new InvalidFormatError(options.format);
  }
}

/**
 * Validate object mask options.
 *
 * @param options - Options to validate
 */
function validateObjectOptions(options: ObjectMaskOptions): void {
  validateOptions(options);

  if (options.fields) {
    for (const [path, maskerType] of Object.entries(options.fields)) {
      if (typeof maskerType !== 'string') {
        throw new Error(`Invalid masker type for field "${path}"`);
      }

      if (!isValidFieldPath(path)) {
        throw new InvalidFieldPathError(path);
      }
    }
  }
}

// Export all types
export type * from './types';

// Export error classes
export * from './errors';

// Export utilities
export * from './utils/string';
export * from './utils/validation';

// Export strategies and formats
export * from './strategies';
export * from './formats';

// Export traverser
export * from './traverser';

// Export plugins
export * from './plugins';
