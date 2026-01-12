/**
 * @oxog/mask - Object Traverser
 *
 * Deep traversal engine for masking nested objects and arrays.
 */

import type { ObjectMaskOptions, TraversalContext } from './types';
import { MaskKernel } from './kernel';
import { CircularReferenceError } from './errors';

/**
 * Traverse an object and mask fields according to the field mapping.
 *
 * @param obj - The object to traverse
 * @param options - Masking options
 * @param context - Traversal context
 * @returns The masked object
 *
 * @example
 * ```typescript
 * const user = {
 *   name: "John",
 *   email: "john@example.com"
 * };
 *
 * traverse(user, {
 *   fields: { email: 'email' },
 *   deep: true
 * });
 * // → { name: "John", email: "j***n@example.com" }
 * ```
 */
export function traverse<T>(
  obj: T,
  options: ObjectMaskOptions,
  context: TraversalContext
): T {
  // Handle primitives
  if (isPrimitive(obj)) {
    return obj;
  }

  // Handle null
  if (obj === null) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return traverseArray(obj, options, context) as T;
  }

  // Handle objects
  return traverseObject(obj as object, options, context) as T;
}

/**
 * Traverse an array.
 *
 * @param arr - The array to traverse
 * @param options - Masking options
 * @param context - Traversal context
 * @returns The traversed array
 */
function traverseArray<T>(
  arr: T[],
  options: ObjectMaskOptions,
  context: TraversalContext
): T[] {
  // Return empty array if maskArrays is false
  if (options.maskArrays === false) {
    return arr;
  }

  // Check for circular reference
  if (context.visited?.has(arr)) {
    return arr;
  }

  const result: T[] = new Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    result[i] = traverse(arr[i], options, context) as T;
  }

  return result;
}

/**
 * Traverse an object.
 *
 * @param obj - The object to traverse
 * @param options - Masking options
 * @param context - Traversal context
 * @returns The traversed object
 */
function traverseObject<T extends object>(
  obj: T,
  options: ObjectMaskOptions,
  context: TraversalContext
): T {
  // Initialize circular reference tracker
  if (!context.visited) {
    context.visited = new WeakSet<object>();
  }

  // Check for circular reference
  if (context.visited.has(obj)) {
    return obj;
  }

  // Mark as visited
  context.visited.add(obj);

  const result = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    const path = context.currentPath
      ? `${context.currentPath}.${key}`
      : key;

    // Check if field should be masked
    const maskerType = findMaskerForField(path, options.fields);

    if (maskerType) {
      // Apply masking if it's a string
      if (typeof value === 'string') {
        result[key as keyof T] = context.kernel.executeMask(
          maskerType,
          value,
          options
        ) as T[keyof T];
      } else {
        // If not a string, convert to string first or keep as-is
        result[key as keyof T] = value;
      }
    } else if (options.deep !== false && isObject(value)) {
      // Recursively traverse nested objects
      result[key as keyof T] = traverse(value, options, {
        ...context,
        currentPath: path,
      }) as T[keyof T];
    } else if (Array.isArray(value) && options.maskArrays !== false) {
      // Handle arrays
      result[key as keyof T] = traverse(value, options, {
        ...context,
        currentPath: path,
      }) as T[keyof T];
    } else {
      // Keep field as-is
      result[key as keyof T] = value;
    }
  }

  return result;
}

/**
 * Check if a value is a primitive.
 *
 * @param value - The value to check
 * @returns True if the value is a primitive
 */
function isPrimitive(value: unknown): boolean {
  return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint' || typeof value === 'symbol' || typeof value === 'undefined';
}

/**
 * Check if a value is an object (not a primitive or array).
 *
 * @param value - The value to check
 * @returns True if the value is an object
 */
function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Find the masker type for a field path.
 *
 * @param path - The field path
 * @param fields - The field mapping
 * @returns The masker type or undefined if not found
 */
function findMaskerForField(
  path: string,
  fields?: Record<string, string>
): string | undefined {
  if (!fields) {
    return undefined;
  }

  // First, try exact match
  if (fields[path]) {
    return fields[path];
  }

  // Then try parent-child matching
  const keys = Object.keys(fields);

  for (const fieldPath of keys) {
    // Check if the field path matches (including wildcards)
    if (matchesPath(path, fieldPath)) {
      return fields[fieldPath];
    }
  }

  return undefined;
}

/**
 * Check if a path matches a pattern (supports wildcards).
 *
 * @param path - The actual path
 * @param pattern - The pattern to match against
 * @returns True if the path matches the pattern
 *
 * @example
 * ```typescript
 * matchesPath("user.email", "user.email");      // → true
 * matchesPath("user.email", "user.*");           // → true
 * matchesPath("address.street", "user.email");   // → false
 * ```
 */
function matchesPath(path: string, pattern: string): boolean {
  // Support wildcard * at the end of patterns
  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -2);
    return path.startsWith(prefix) && (path === prefix || path[prefix.length] === '.');
  }

  // Exact match
  return path === pattern;
}

/**
 * Validate a field path.
 *
 * @param path - The field path to validate
 * @returns True if the path is valid
 *
 * @example
 * ```typescript
 * isValidFieldPath("email");                    // → true
 * isValidFieldPath("user.email");              // → true
 * isValidFieldPath("user.address.street");     // → true
 * isValidFieldPath("user..email");             // → false (double dot)
 * isValidFieldPath(".email");                  // → false (starts with dot)
 * isValidFieldPath("email.");                  // → false (ends with dot)
 * ```
 */
export function isValidFieldPath(path: string): boolean {
  // Empty or only whitespace
  if (!path || path.trim() !== path) {
    return false;
  }

  // Cannot start or end with dot
  if (path.startsWith('.') || path.endsWith('.')) {
    return false;
  }

  // Cannot contain double dots
  if (path.includes('..')) {
    return false;
  }

  // Must be valid identifier or dotted identifiers
  const parts = path.split('.');

  for (const part of parts) {
    // Each part must be a valid identifier
    // Allow alphanumeric and underscore
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(part)) {
      return false;
    }
  }

  return true;
}

/**
 * Get all parent paths of a field path.
 *
 * @param path - The field path
 * @returns Array of parent paths
 *
 * @example
 * ```typescript
 * getParentPaths("user.email");
 * // → ["user"]
 *
 * getParentPaths("user.address.street");
 * // → ["user", "user.address"]
 * ```
 */
export function getParentPaths(path: string): string[] {
  const parts = path.split('.');
  const parents: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    parents.push(parts.slice(0, i).join('.'));
  }

  return parents;
}

/**
 * Check if a field path is a child of another path.
 *
 * @param child - The child path
 * @param parent - The parent path
 * @returns True if child is a child of parent
 *
 * @example
 * ```typescript
 * isChildPath("user.email", "user");                    // → true
 * isChildPath("user.address.street", "user");           // → true
 * isChildPath("user.address.street", "user.address");   // → true
 * isChildPath("user", "user.email");                   // → false
 * ```
 */
export function isChildPath(child: string, parent: string): boolean {
  if (child === parent) {
    return false;
  }

  return child.startsWith(parent + '.');
}
