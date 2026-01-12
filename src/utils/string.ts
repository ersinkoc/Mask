/**
 * @oxog/mask - String Utilities
 *
 * Utility functions for string manipulation without external dependencies.
 */

/**
 * Check if a value is a string.
 *
 * @param value - The value to check
 * @returns True if the value is a string
 *
 * @example
 * ```typescript
 * isString("hello");  // → true
 * isString(123);      // → false
 * isString(null);     // → false
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Pad a string to a specified length with a character.
 *
 * @param str - The string to pad
 * @param length - The desired length
 * @param char - The padding character (default: ' ')
 * @returns The padded string
 *
 * @example
 * ```typescript
 * pad("123", 5, '0');  // → "00123"
 * pad("abc", 5);        // → "abc  "
 * pad("abc", 2);        // → "abc" (no truncation)
 * ```
 */
export function pad(str: string, length: number, char: string = ' '): string {
  if (length <= str.length) {
    return str;
  }
  const padding = repeat(char, length - str.length);
  return str + padding;
}

/**
 * Truncate a string to a maximum length.
 *
 * @param str - The string to truncate
 * @param maxLength - The maximum length
 * @param ellipsis - The ellipsis string (default: '...')
 * @returns The truncated string
 *
 * @example
 * ```typescript
 * truncate("hello world", 5);        // → "he..."
 * truncate("hello world", 20);       // → "hello world" (no truncation)
 * truncate("hello world", 5, '…');   // → "he…"
 * ```
 */
export function truncate(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (maxLength >= str.length) {
    return str;
  }
  if (maxLength <= ellipsis.length) {
    return str.substring(0, maxLength);
  }
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Repeat a character or string N times.
 *
 * @param char - The character or string to repeat
 * @param count - Number of times to repeat
 * @returns The repeated string
 *
 * @example
 * ```typescript
 * repeat('*', 5);      // → "*****"
 * repeat('ab', 3);     // → "ababab"
 * repeat('*', 0);      // → ""
 * ```
 */
export function repeat(char: string, count: number): string {
  if (count <= 0) {
    return '';
  }
  return char.repeat(count);
}

/**
 * Get the byte length of a string in UTF-8 encoding.
 *
 * @param str - The string to measure
 * @returns The byte length
 *
 * @example
 * ```typescript
 * byteLength("hello");           // → 5
 * byteLength("héllo");           // → 6 (é is 2 bytes in UTF-8)
 * byteLength("😀");             // → 4 (emoji is 4 bytes in UTF-8)
 * ```
 */
export function byteLength(str: string): number {
  // Simple UTF-8 byte length calculation
  // For ASCII, this equals str.length
  // For non-ASCII, this gives accurate byte count
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      bytes += 1;
    } else if (charCode < 0x800) {
      bytes += 2;
    } else if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
      // Skip surrogate pairs
      continue;
    } else if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      // Handle surrogate pairs (emojis, etc.)
      bytes += 4;
      i++; // Skip next character as it's part of the surrogate pair
    } else {
      bytes += 3;
    }
  }
  return bytes;
}

/**
 * Escape special regex characters in a string.
 *
 * @param str - The string to escape
 * @returns The escaped string
 *
 * @example
 * ```typescript
 * escapeRegex("a.b*c");  // → "a\\.b\\*c"
 * ```
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if a string starts with a given prefix.
 *
 * @param str - The string to check
 * @param prefix - The prefix to look for
 * @returns True if the string starts with the prefix
 *
 * @example
 * ```typescript
 * startsWith("hello world", "hello");  // → true
 * startsWith("hello world", "world");  // → false
 * ```
 */
export function startsWith(str: string, prefix: string): boolean {
  if (prefix.length === 0) {
    return true;
  }
  if (str.length < prefix.length) {
    return false;
  }
  return str.substring(0, prefix.length) === prefix;
}

/**
 * Check if a string ends with a given suffix.
 *
 * @param str - The string to check
 * @param suffix - The suffix to look for
 * @returns True if the string ends with the suffix
 *
 * @example
 * ```typescript
 * endsWith("hello world", "world");  // → true
 * endsWith("hello world", "hello");  // → false
 * ```
 */
export function endsWith(str: string, suffix: string): boolean {
  if (suffix.length === 0) {
    return true;
  }
  if (str.length < suffix.length) {
    return false;
  }
  return str.substring(str.length - suffix.length) === suffix;
}

/**
 * Extract substring between two markers.
 *
 * @param str - The string to search
 * @param start - Start marker
 * @param end - End marker
 * @returns The substring between markers, or null if not found
 *
 * @example
 * ```typescript
 * between("prefix[content]suffix", "[", "]");  // → "content"
 * between("prefix(content)suffix", "[", "]");  // → null
 * ```
 */
export function between(str: string, start: string, end: string): string | null {
  const startIndex = str.indexOf(start);
  if (startIndex === -1) {
    return null;
  }
  const endIndex = str.indexOf(end, startIndex + start.length);
  if (endIndex === -1) {
    return null;
  }
  return str.substring(startIndex + start.length, endIndex);
}

/**
 * Count occurrences of a substring in a string.
 *
 * @param str - The string to search
 * @param substring - The substring to count
 * @returns The number of occurrences
 *
 * @example
 * ```typescript
 * countOccurrences("hello world", "l");  // → 3
 * countOccurrences("hello world", "x"); // → 0
 * ```
 */
export function countOccurrences(str: string, substring: string): number {
  if (substring.length === 0) {
    return 0;
  }
  let count = 0;
  let index = 0;
  while ((index = str.indexOf(substring, index)) !== -1) {
    count++;
    index += substring.length;
  }
  return count;
}

/**
 * Reverse a string.
 *
 * @param str - The string to reverse
 * @returns The reversed string
 *
 * @example
 * ```typescript
 * reverse("hello");  // → "olleh"
 * reverse("");        // → ""
 * ```
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Capitalize the first letter of a string.
 *
 * @param str - The string to capitalize
 * @returns The capitalized string
 *
 * @example
 * ```typescript
 * capitalize("hello");  // → "Hello"
 * capitalize("HELLO");  // → "HELLO" (only first letter)
 * capitalize("");       // → ""
 * ```
 */
export function capitalize(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to title case.
 *
 * @param str - The string to convert
 * @returns The title-cased string
 *
 * @example
 * ```typescript
 * titleCase("hello world");  // → "Hello World"
 * titleCase("foo-bar");      // → "Foo Bar"
 * ```
 */
export function titleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => capitalize(word.toLowerCase()))
    .join(' ');
}
