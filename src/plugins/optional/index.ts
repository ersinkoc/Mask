/**
 * @oxog/mask - Optional Plugins
 *
 * Optional plugins that can be loaded on demand.
 */

export { iban } from './iban';
export { ip } from './ip';
export { jwt } from './jwt';
export { ssn } from './ssn';
export { url } from './url';
export { autoDetect, autoDetectFields, DEFAULT_PATTERNS } from './auto-detect';
export { trLocale } from './locale-tr';
export { usLocale } from './locale-us';
export { custom, createCustomMaskerFunction, COMMON_PATTERNS, quickCustom } from './custom';

export { maskIBANFunction } from './iban';
export { maskIPFunction } from './ip';
export { maskJWTFunction } from './jwt';
export { maskSSNFunction } from './ssn';
export { maskURLFunction } from './url';
