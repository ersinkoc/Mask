/**
 * @oxog/mask - Type Definitions
 *
 * This file contains all TypeScript type definitions for the @oxog/mask package.
 * These types are used throughout the library to ensure type safety and provide
 * excellent developer experience.
 */

/**
 * Masking strategy options.
 * Controls which parts of the value remain visible.
 *
 * @example
 * ```typescript
 * // Show first 3 characters
 * const value1 = mask.pattern("ABCDEFGHIJ", { show: 'first:3' });
 * // → "ABC*******"
 *
 * // Show last 4 characters
 * const value2 = mask.pattern("ABCDEFGHIJ", { show: 'last:4' });
 * // → "******GHIJ"
 *
 * // Show first and last, hide middle
 * const value3 = mask.pattern("ABCDEFGHIJ", { show: 'middle' });
 * // → "A********J"
 *
 * // Mask everything
 * const value4 = mask.pattern("ABCDEFGHIJ", { show: 'full' });
 * // → "**********"
 *
 * // Show 50% of the value
 * const value5 = mask.pattern("ABCDEFGHIJ", { show: 'partial:0.5' });
 * // → "ABCDE*****"
 * ```
 */
export type MaskStrategy =
  | 'full'                    // Mask everything: "**********"
  | 'middle'                  // Show first and last: "A********Z"
  | `first:${number}`         // Show first N chars: "ABC*******"
  | `last:${number}`          // Show last N chars: "*******XYZ"
  | `partial:${number}`;      // Show percentage: "ABCDE*****" (0.5 = 50%)

/**
 * Output format options.
 * Controls how the masked value is formatted.
 *
 * @example
 * ```typescript
 * // Display format (for UI)
 * mask.card("4532015112830366", { format: 'display' })
 * // → "**** **** **** 0366"
 *
 * // Compact format (for storage)
 * mask.card("4532015112830366", { format: 'compact' })
 * // → "************0366"
 *
 * // Log format (for structured logging)
 * mask.card("4532015112830366", { format: 'log' })
 * // → "[REDACTED:card]"
 * ```
 */
export type MaskFormat =
  | 'display'                 // Human-readable: "**** **** **** 1234"
  | 'compact'                 // No spaces: "************1234"
  | 'log';                    // For logging: "[REDACTED:card]"

/**
 * Options for masking operations.
 *
 * @example
 * ```typescript
 * mask.email("test@example.com", {
 *   strategy: 'first:2',
 *   format: 'display',
 *   char: '•'
 * })
 * // → "te•••••••••••••••••••••@example.com"
 * ```
 */
export interface MaskOptions {
  /** Strategy for hiding parts of the value */
  strategy?: MaskStrategy;

  /** Output format */
  format?: MaskFormat;

  /** Character used for masking @default '*' */
  char?: string;
}

/**
 * Field mapping for object masking.
 * Keys are dot-notation paths, values are masker types.
 *
 * @example
 * ```typescript
 * const mapping: FieldMapping = {
 *   email: 'email',
 *   phone: 'phone',
 *   'address.creditCard': 'card',
 *   'payment.iban': 'iban'
 * };
 * ```
 */
export type FieldMapping = Record<string,
  | 'email'
  | 'phone'
  | 'card'
  | 'iban'
  | 'ip'
  | 'jwt'
  | 'ssn'
  | 'url'
  | string  // Custom plugin types
>;

/**
 * Options for object masking.
 *
 * @example
 * ```typescript
 * mask(user, {
 *   fields: {
 *     email: 'email',
 *     phone: 'phone'
 *   },
 *   deep: true,
 *   maskArrays: true,
 *   strategy: 'middle',
 *   format: 'display',
 *   char: '*'
 * })
 * ```
 */
export interface ObjectMaskOptions extends MaskOptions {
  /** Field-to-masker mapping */
  fields?: FieldMapping;

  /** Deep traverse nested objects @default true */
  deep?: boolean;

  /** Mask arrays @default true */
  maskArrays?: boolean;
}

/**
 * Configuration for createMask factory.
 *
 * @example
 * ```typescript
 * const customMask = createMask({
 *   char: '•',
 *   defaultFormat: 'display',
 *   defaultStrategy: 'middle',
 *   plugins: [iban(), ip()]
 * });
 * ```
 */
export interface MaskConfig {
  /** Default masking character @default '*' */
  char?: string;

  /** Default output format @default 'display' */
  defaultFormat?: MaskFormat;

  /** Default masking strategy @default 'middle' */
  defaultStrategy?: MaskStrategy;

  /** Plugins to load on creation */
  plugins?: MaskPlugin[];
}

/**
 * Plugin interface for extending mask functionality.
 *
 * @typeParam TContext - Shared context type between plugins
 *
 * @example
 * ```typescript
 * const myPlugin: MaskPlugin = {
 *   name: 'my-masker',
 *   version: '1.0.0',
 *   install: (kernel) => {
 *     kernel.registerMasker('myType', myMaskerFunction);
 *   }
 * };
 * ```
 */
export interface MaskPlugin<TContext = unknown> {
  /** Unique plugin identifier (kebab-case) */
  name: string;

  /** Semantic version (e.g., "1.0.0") */
  version: string;

  /** Other plugins this plugin depends on */
  dependencies?: string[];

  /**
   * Called when plugin is registered.
   * @param kernel - The kernel instance
   */
  install: (kernel: MaskKernel<TContext>) => void;

  /**
   * Called after all plugins are installed.
   * @param context - Shared context object
   */
  onInit?: (context: TContext) => void | Promise<void>;

  /**
   * Called when plugin is unregistered.
   */
  onDestroy?: () => void | Promise<void>;

  /**
   * Called on error in this plugin.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}

/**
 * Masker function type.
 *
 * @param value - The value to mask
 * @param options - Masking options
 * @returns The masked value
 *
 * @example
 * ```typescript
 * const emailMasker: MaskerFunction = (value: string, options: MaskOptions) => {
 *   // Masking logic
 *   return maskedValue;
 * };
 * ```
 */
export type MaskerFunction = (value: string, options?: MaskOptions) => string;

/**
 * Core kernel interface for managing plugins and maskers.
 *
 * @typeParam TContext - Shared context type between plugins
 */
export interface MaskKernel<TContext = unknown> {
  /**
   * Register a plugin with the kernel.
   * @param plugin - The plugin to register
   */
  registerPlugin(plugin: MaskPlugin<TContext>): void;

  /**
   * Unregister a plugin.
   * @param name - Plugin name
   * @returns True if plugin was removed, false if not found
   */
  unregisterPlugin(name: string): boolean;

  /**
   * Get a registered plugin by name.
   * @param name - Plugin name
   * @returns The plugin or undefined if not found
   */
  getPlugin(name: string): MaskPlugin<TContext> | undefined;

  /**
   * List all registered plugin names.
   * @returns Array of plugin names
   */
  listPlugins(): string[];

  /**
   * Register a masker function for a type.
   * @param type - The masker type name
   * @param masker - The masker function
   */
  registerMasker(type: string, masker: MaskerFunction): void;

  /**
   * Get a masker function by type.
   * @param type - The masker type
   * @returns The masker function or undefined if not found
   */
  getMasker(type: string): MaskerFunction | undefined;

  /**
   * Execute a masker on a value.
   * @param type - The masker type
   * @param value - The value to mask
   * @param options - Masking options
   * @returns The masked value
   */
  executeMask(type: string, value: string, options?: MaskOptions): string;

  /**
   * Get the shared context.
   * @returns The shared context object
   */
  getContext(): TContext;
}

/**
 * Strategy handler function type.
 *
 * @param value - The value to mask
 * @param strategy - The strategy to apply
 * @param char - The masking character
 * @returns The masked value
 */
export type StrategyHandler = (value: string, strategy: Exclude<MaskStrategy, string>, char: string) => string;

/**
 * Format handler function type.
 *
 * @param value - The formatted value
 * @param type - The masker type
 * @returns The formatted value
 */
export type FormatHandler = (value: string, type: string) => string;

/**
 * The main mask instance interface.
 *
 * @example
 * ```typescript
 * const mask: MaskInstance;
 *
 * // Primitive masking
 * mask.email("test@example.com");
 * mask.phone("+15551234567");
 * mask.card("4532015112830366");
 * mask.pattern("ABC123XYZ", { show: 'last:3' });
 *
 * // Object masking
 * mask(user, { fields: { email: 'email', phone: 'phone' } });
 *
 * // Plugin management
 * mask.use(plugin);
 * mask.unregister('plugin-name');
 * mask.list();
 * mask.has('plugin-name');
 * ```
 */
export interface MaskInstance {
  // Primitive maskers
  /**
   * Mask an email address.
   * @param value - The email to mask
   * @param options - Masking options
   * @returns The masked email
   *
   * @example
   * ```typescript
   * mask.email("ersin@oxog.dev");
   * // → "e***n@o***.dev"
   * ```
   */
  email(value: string, options?: MaskOptions): string;

  /**
   * Mask a phone number.
   * @param value - The phone number to mask
   * @param options - Masking options
   * @returns The masked phone number
   *
   * @example
   * ```typescript
   * mask.phone("+905551234567");
   * // → "+90*****4567"
   * ```
   */
  phone(value: string, options?: MaskOptions): string;

  /**
   * Mask a credit card number.
   * @param value - The card number to mask
   * @param options - Masking options
   * @returns The masked card number
   *
   * @example
   * ```typescript
   * mask.card("4532015112830366");
   * // → "**** **** **** 0366"
   * ```
   */
  card(value: string, options?: MaskOptions): string;

  /**
   * Apply a generic pattern mask.
   * @param value - The value to mask
   * @param options - Masking options with show property
   * @returns The masked value
   *
   * @example
   * ```typescript
   * mask.pattern("ABCDEFGHIJ", { show: 'first:3' });
   * // → "ABC*******"
   * ```
   */
  pattern(value: string, options?: MaskOptions & { show?: MaskStrategy }): string;

  // Object masking
  /**
   * Mask fields in an object.
   * @param obj - The object to mask
   * @param options - Object masking options
   * @returns The masked object
   *
   * @example
   * ```typescript
   * mask(user, {
   *   fields: {
   *     email: 'email',
   *     phone: 'phone'
   *   }
   * });
   * ```
   */
  <T extends object>(obj: T, options?: ObjectMaskOptions): T;

  // Plugin management
  /**
   * Register a plugin.
   * @param plugin - The plugin to register
   * @returns The mask instance for chaining
   *
   * @example
   * ```typescript
   * mask.use(iban());
   * ```
   */
  use(plugin: MaskPlugin): MaskInstance;

  /**
   * Unregister a plugin.
   * @param name - Plugin name
   * @returns True if plugin was removed
   *
   * @example
   * ```typescript
   * mask.unregister('iban');
   * ```
   */
  unregister(name: string): boolean;

  /**
   * List all registered plugins.
   * @returns Array of plugin names
   *
   * @example
   * ```typescript
   * mask.list();
   * // → ['email', 'phone', 'card', 'iban']
   * ```
   */
  list(): string[];

  /**
   * Check if a plugin is registered.
   * @param name - Plugin name
   * @returns True if plugin is registered
   *
   * @example
   * ```typescript
   * mask.has('email');
   * // → true
   * ```
   */
  has(name: string): boolean;
}

/**
 * Factory function to create a mask instance with custom configuration.
 *
 * @param config - Optional configuration
 * @returns A new mask instance
 *
 * @example
 * ```typescript
 * const customMask = createMask({
 *   char: '•',
 *   defaultStrategy: 'middle'
 * });
 *
 * customMask.email("test@example.com");
 * // → "t•••t@e•••.com"
 * ```
 */
export type CreateMask = (config?: MaskConfig) => MaskInstance;

/**
 * Traversal context for object traversal.
 */
export interface TraversalContext {
  /** Current path being traversed */
  currentPath?: string;
  /** Kernel instance */
  kernel: MaskKernel;
  /** Circular reference tracker */
  visited?: WeakSet<object>;
}

/**
 * Strategy configuration for validation.
 */
export interface StrategyConfig {
  /** Strategy name */
  name: string;
  /** Minimum value for numeric strategies */
  min?: number;
  /** Maximum value for numeric strategies */
  max?: number;
}

/**
 * Error context interface.
 */
export interface ErrorContext {
  /** Plugin name if applicable */
  pluginName?: string;
  /** Value being processed */
  value?: string;
  /** Additional context */
  [key: string]: unknown;
}
