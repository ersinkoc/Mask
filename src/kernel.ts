/**
 * @oxog/mask - Micro Kernel
 *
 * Core micro-kernel for managing plugins and executing maskers.
 */

import type {
  MaskKernel as IMaskKernel,
  MaskPlugin,
  MaskerFunction,
  MaskOptions,
  TContext,
} from './types';
import {
  MaskerNotFoundError,
  PluginError,
  PluginInitError,
  PluginNotFoundError,
  PluginRegistrationError,
  InvalidValueError,
} from './errors';

/**
 * Micro-kernel for managing plugins and maskers.
 *
 * @typeParam TContext - Shared context type between plugins
 *
 * @example
 * ```typescript
 * const kernel = new MaskKernel<string>();
 * kernel.registerPlugin(emailPlugin);
 * kernel.executeMask('email', 'test@example.com');
 * // → "t***t@e***.com"
 * ```
 */
export class MaskKernel<TContext = unknown> implements IMaskKernel<TContext> {
  private plugins: Map<string, MaskPlugin<TContext>> = new Map();
  private maskers: Map<string, MaskerFunction> = new Map();
  private context: TContext;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Create a new kernel instance.
   *
   * @param initialContext - Optional initial context
   */
  constructor(initialContext?: TContext) {
    this.context = initialContext || ({} as TContext);
  }

  /**
   * Register a plugin with the kernel.
   *
   * @param plugin - The plugin to register
   * @throws {PluginRegistrationError} If plugin is already registered
   */
  registerPlugin(plugin: MaskPlugin<TContext>): void {
    // Validate plugin
    if (!plugin.name) {
      throw new PluginRegistrationError('Plugin must have a name', 'unknown');
    }

    if (!plugin.version) {
      throw new PluginRegistrationError('Plugin must have a version', plugin.name);
    }

    if (typeof plugin.install !== 'function') {
      throw new PluginRegistrationError('Plugin must have an install function', plugin.name);
    }

    // Check if already registered
    if (this.plugins.has(plugin.name)) {
      throw new PluginRegistrationError(
        `Plugin "${plugin.name}" is already registered`,
        plugin.name
      );
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new PluginError(
            `Missing dependency: ${dep}`,
            plugin.name,
            { dependency: dep }
          );
        }
      }
    }

    // Register the plugin
    this.plugins.set(plugin.name, plugin);

    try {
      // Install the plugin
      plugin.install(this);

      // Mark as dirty for re-initialization
      this.initialized = false;
    } catch (error) {
      // Rollback plugin registration
      this.plugins.delete(plugin.name);

      if (error instanceof Error) {
        throw new PluginInitError(
          `Failed to install plugin "${plugin.name}": ${error.message}`,
          plugin.name,
          error
        );
      } else {
        throw new PluginInitError(
          `Failed to install plugin "${plugin.name}": Unknown error`,
          plugin.name
        );
      }
    }
  }

  /**
   * Unregister a plugin.
   *
   * @param name - Plugin name
   * @returns True if plugin was removed
   */
  unregisterPlugin(name: string): boolean {
    const plugin = this.plugins.get(name);

    if (!plugin) {
      return false;
    }

    // Call onDestroy if provided
    if (plugin.onDestroy) {
      try {
        plugin.onDestroy();
      } catch (error) {
        // Log error but don't fail unregistration
        if (plugin.onError && error instanceof Error) {
          plugin.onError(error);
        }
      }
    }

    // Remove plugin
    this.plugins.delete(name);

    // Mark as dirty for re-initialization
    this.initialized = false;

    return true;
  }

  /**
   * Get a registered plugin by name.
   *
   * @param name - Plugin name
   * @returns The plugin or undefined if not found
   */
  getPlugin(name: string): MaskPlugin<TContext> | undefined {
    return this.plugins.get(name);
  }

  /**
   * List all registered plugin names.
   *
   * @returns Array of plugin names
   */
  listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Register a masker function for a type.
   *
   * @param type - The masker type name
   * @param masker - The masker function
   */
  registerMasker(type: string, masker: MaskerFunction): void {
    if (!type) {
      throw new PluginError('Masker type cannot be empty', 'kernel');
    }

    if (typeof masker !== 'function') {
      throw new PluginError('Masker must be a function', 'kernel');
    }

    this.maskers.set(type, masker);
  }

  /**
   * Get a masker function by type.
   *
   * @param type - The masker type
   * @returns The masker function or undefined if not found
   */
  getMasker(type: string): MaskerFunction | undefined {
    return this.maskers.get(type);
  }

  /**
   * Execute a masker on a value.
   *
   * @param type - The masker type
   * @param value - The value to mask
   * @param options - Masking options
   * @returns The masked value
   * @throws {MaskerNotFoundError} If no masker is registered for the type
   */
  executeMask(type: string, value: string, options?: MaskOptions): string {
    if (typeof value !== 'string') {
      throw new InvalidValueError('Value must be a string', { value, type });
    }

    const masker = this.maskers.get(type);

    if (!masker) {
      throw new MaskerNotFoundError(type);
    }

    return masker(value, options);
  }

  /**
   * Get the shared context.
   *
   * @returns The shared context object
   */
  getContext(): TContext {
    return this.context;
  }

  /**
   * Update the shared context.
   *
   * @param updater - Function to update the context
   */
  updateContext(updater: (context: TContext) => void): void {
    updater(this.context);
    this.initialized = false;
  }

  /**
   * Initialize all plugins (call onInit hooks).
   * This is called automatically when needed and can be called manually if needed.
   *
   * @returns Promise that resolves when all plugins are initialized
   */
  async initialize(): Promise<void> {
    // If already initialized, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // If already initialized, skip
    if (this.initialized) {
      return;
    }

    // Create initialization promise
    this.initializationPromise = this.doInitialize();

    try {
      await this.initializationPromise;
      this.initialized = true;
    } finally {
      this.initializationPromise = null;
    }
  }

  /**
   * Perform the actual initialization.
   */
  private async doInitialize(): Promise<void> {
    const initPromises: Promise<void>[] = [];

    for (const plugin of this.plugins.values()) {
      if (plugin.onInit) {
        try {
          const result = plugin.onInit(this.context);

          if (result instanceof Promise) {
            initPromises.push(result);
          }
        } catch (error) {
          // Call onError if provided
          if (plugin.onError && error instanceof Error) {
            plugin.onError(error);
          }

          // Re-throw to fail initialization
          throw error;
        }
      }
    }

    // Wait for all async initializations
    if (initPromises.length > 0) {
      await Promise.all(initPromises);
    }
  }

  /**
   * Check if all plugins are initialized.
   *
   * @returns True if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Force re-initialization of all plugins.
   *
   * @returns Promise that resolves when re-initialization is complete
   */
  async reinitialize(): Promise<void> {
    this.initialized = false;
    this.initializationPromise = null;
    await this.initialize();
  }

  /**
   * Get the number of registered plugins.
   *
   * @returns Number of plugins
   */
  getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * Get the number of registered maskers.
   *
   * @returns Number of maskers
   */
  getMaskerCount(): number {
    return this.maskers.size;
  }

  /**
   * Check if a plugin is registered.
   *
   * @param name - Plugin name
   * @returns True if registered
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Check if a masker type is registered.
   *
   * @param type - Masker type
   * @returns True if registered
   */
  hasMasker(type: string): boolean {
    return this.maskers.has(type);
  }

  /**
   * Clear all plugins and maskers.
   * This is useful for testing or resetting the kernel.
   */
  reset(): void {
    this.plugins.clear();
    this.maskers.clear();
    this.initialized = false;
    this.initializationPromise = null;
  }

  /**
   * Get information about the kernel state.
   *
   * @returns Kernel state information
   */
  getState(): {
    pluginCount: number;
    maskerCount: number;
    initialized: boolean;
    plugins: string[];
    maskers: string[];
  } {
    return {
      pluginCount: this.plugins.size,
      maskerCount: this.maskers.size,
      initialized: this.initialized,
      plugins: this.listPlugins(),
      maskers: Array.from(this.maskers.keys()),
    };
  }
}
