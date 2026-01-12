/**
 * @oxog/mask - Validation Utilities
 *
 * Validation functions for various data types without external dependencies.
 */

/**
 * Check if a value is a valid email address.
 *
 * @param email - The email to validate
 * @returns True if the email is valid
 *
 * @example
 * ```typescript
 * isValidEmail("test@example.com");      // → true
 * isValidEmail("invalid.email");         // → false
 * isValidEmail("test@");                 // → false
 * ```
 */
export function isValidEmail(email: string): boolean {
  // Simple but effective email validation
  // More complex than RFC 5322 but catches most invalid cases

  // Check if email is a string
  if (typeof email !== 'string') {
    return false;
  }

  // Check basic format - must have exactly one @, at least one dot after @
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) {
    return false;
  }

  // Check for multiple @ signs
  if (email.indexOf('@') !== atIndex) {
    return false;
  }

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex + 1);

  // Local part must not be empty
  if (localPart.length === 0) {
    return false;
  }

  // Domain must have at least one dot and not start with dot
  if (domainPart.indexOf('.') === -1 || domainPart.startsWith('.')) {
    return false;
  }

  // Check for consecutive dots in local part
  if (localPart.includes('..')) {
    return false;
  }

  // Check for dot at start or end of local part
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  return true;
}

/**
 * Check if a value is a valid phone number.
 * Accepts international format with country codes.
 *
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid
 *
 * @example
 * ```typescript
 * isValidPhone("+905551234567");         // → true
 * isValidPhone("+1-555-123-4567");       // → true
 * isValidPhone("5551234567");           // → true
 * isValidPhone("invalid");              // → false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  // Strip all non-digits except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Must have at least 7 digits (simple validation)
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 7) {
    return false;
  }

  // Check for valid format
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone);
}

/**
 * Check if a value is a valid credit card number using Luhn algorithm.
 *
 * @param card - The card number to validate
 * @returns True if the card number is valid
 *
 * @example
 * ```typescript
 * isValidCard("4532015112830366");  // → true (Visa)
 * isValidCard("5555555555554444");  // → true (Mastercard)
 * isValidCard("1234567890123456");  // → false (fails Luhn check)
 * ```
 */
export function isValidCard(card: string): boolean {
  // Remove all non-digits
  const digits = card.replace(/\D/g, '');

  // Must have between 13 and 19 digits
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;

  // Traverse from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Check if a value is a valid IBAN.
 *
 * @param iban - The IBAN to validate
 * @returns True if the IBAN is valid
 *
 * @example
 * ```typescript
 * isValidIBAN("TR330006100519786457841326");  // → true
 * isValidIBAN("GB29 NWBK 6016 1331 9268 19");  // → true
 * isValidIBAN("INVALID");                     // → false
 * ```
 */
export function isValidIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();

  // Check basic format
  if (cleanIBAN.length < 15 || cleanIBAN.length > 34) {
    return false;
  }

  // Check if first two characters are letters (country code)
  if (!/^[A-Z]{2}/.test(cleanIBAN)) {
    return false;
  }

  // Check if next two digits are numbers (check digits)
  if (!/^\d{2}/.test(cleanIBAN.substring(2))) {
    return false;
  }

  // Move first four chars to the end
  const rearranged = cleanIBAN.substring(4) + cleanIBAN.substring(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged.replace(/[A-Z]/g, (letter) => {
    return (letter.charCodeAt(0) - 55).toString();
  });

  // Calculate mod 97 using string processing
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    const char = numericString.charAt(i);
    const digit = parseInt(char, 10);
    remainder = (remainder * 10 + digit) % 97;
  }

  return remainder === 1;
}

/**
 * Check if a value is a valid IPv4 address.
 *
 * @param ip - The IP address to validate
 * @returns True if the IP address is valid
 *
 * @example
 * ```typescript
 * isValidIP("192.168.1.1");      // → true
 * isValidIP("255.255.255.255");  // → true
 * isValidIP("256.1.1.1");        // → false (out of range)
 * isValidIP("invalid");          // → false
 * ```
 */
export function isValidIP(ip: string): boolean {
  const parts = ip.split('.');

  if (parts.length !== 4) {
    return false;
  }

  for (const part of parts) {
    // Check if part is a number
    if (!/^\d+$/.test(part)) {
      return false;
    }

    const num = parseInt(part, 10);

    // Check if in range 0-255
    if (num < 0 || num > 255) {
      return false;
    }

    // Check for leading zeros (except for "0")
    if (part.length > 1 && part[0] === '0') {
      return false;
    }
  }

  return true;
}

/**
 * Check if a value is a valid IPv6 address.
 *
 * @param ip - The IP address to validate
 * @returns True if the IP address is valid
 *
 * @example
 * ```typescript
 * isValidIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334");  // → true
 * isValidIPv6("::1");                                       // → true (loopback)
 * isValidIPv6("invalid");                                   // → false
 * ```
 */
export function isValidIPv6(ip: string): boolean {
  // IPv6 addresses are complex, this is a simplified validation
  // Handle compressed notation (::)

  if (ip.includes('::')) {
    // Can only have one :: in the address
    if (ip.split('::').length - 1 > 1) {
      return false;
    }

    // Check for invalid patterns like ::: which has multiple colons
    if (ip.includes(':::')) {
      return false;
    }

    // Split on ::
    const parts = ip.split('::');
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];

    // Count total parts (should be 8)
    const totalParts = left.length + right.length;
    if (totalParts > 8) {
      return false;
    }

    // Check each part
    for (const part of [...left, ...right]) {
      if (part === '') continue; // Skip empty parts from ::
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
        return false;
      }
    }
  } else {
    // No compression, must have exactly 8 parts
    const parts = ip.split(':');

    if (parts.length !== 8) {
      return false;
    }

    for (const part of parts) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if a value is a valid URL.
 *
 * @param url - The URL to validate
 * @returns True if the URL is valid
 *
 * @example
 * ```typescript
 * isValidURL("https://example.com");      // → true
 * isValidURL("http://example.com/path");  // → true
 * isValidURL("not-a-url");                // → false
 * ```
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a value is a valid Social Security Number (US).
 *
 * @param ssn - The SSN to validate
 * @returns True if the SSN is valid
 *
 * @example
 * ```typescript
 * isValidSSN("123-45-6789");  // → true
 * isValidSSN("123456789");    // → true
 * isValidSSN("000-00-0000");  // → false (all zeros)
 * isValidSSN("1234567890");   // → false (too long)
 * ```
 */
export function isValidSSN(ssn: string): boolean {
  // Remove hyphens and spaces
  const digits = ssn.replace(/[\s-]/g, '');

  // Must be 9 digits
  if (!/^\d{9}$/.test(digits)) {
    return false;
  }

  // Cannot be all zeros
  if (digits === '000000000') {
    return false;
  }

  // Cannot start with 000, 666, or 900-999
  const firstThree = parseInt(digits.substring(0, 3), 10);
  if (firstThree === 0 || firstThree === 666 || firstThree >= 900) {
    return false;
  }

  // Cannot be 00
  const middleTwo = parseInt(digits.substring(3, 5), 10);
  if (middleTwo === 0) {
    return false;
  }

  // Cannot be 0000
  const lastFour = parseInt(digits.substring(5), 10);
  if (lastFour === 0) {
    return false;
  }

  return true;
}

/**
 * Check if a value is a valid JWT token.
 *
 * @param token - The JWT token to validate
 * @returns True if the token appears to be a valid JWT
 *
 * @example
 * ```typescript
 * isValidJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U");
 * // → true
 * ```
 */
export function isValidJWT(token: string): boolean {
  // JWT has 3 parts separated by dots
  const parts = token.split('.');

  if (parts.length !== 3) {
    return false;
  }

  // Each part should be base64url encoded
  for (const part of parts) {
    // Base64url alphabet: A-Z, a-z, 0-9, -, _
    // Padding with = is allowed but not required
    if (!/^[A-Za-z0-9_-]+={0,2}$/.test(part)) {
      return false;
    }
  }

  try {
    // Try to decode and parse the header
    const header = JSON.parse(atob((parts[0] || '').replace(/-/g, '+').replace(/_/g, '/')));

    // Should have typ and alg fields
    if (!header.typ || !header.alg) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid hexadecimal color code.
 *
 * @param color - The color code to validate
 * @returns True if the color code is valid
 *
 * @example
 * ```typescript
 * isValidHexColor("#FF0000");  // → true
 * isValidHexColor("#fff");     // → true
 * isValidHexColor("red");       // → false
 * ```
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}
