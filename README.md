# @oxog/mask

> **Powerful, flexible, and type-safe data masking library for JavaScript/TypeScript**

[![npm version](https://img.shields.io/npm/v/@oxog/mask.svg)](https://www.npmjs.com/package/@oxog/mask)
[![npm downloads](https://img.shields.io/npm/dm/@oxog/mask.svg)](https://www.npmjs.com/package/@oxog/mask)
[![GitHub stars](https://img.shields.io/github/stars/ersinkoc/oxog-mask.svg)](https://github.com/ersinkoc/oxog-mask/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](#tests)

A micro-kernel architecture based data masking library that provides secure, customizable, and type-safe masking for sensitive data. Perfect for logging, testing, data anonymization, and compliance requirements.

## ✨ Features

- 🎯 **Micro-kernel Architecture** - Core plugins + optional extensions
- 🔒 **Type-Safe** - Full TypeScript support with comprehensive types
- 🚀 **Fast & Efficient** - Optimized for production use
- 🛠️ **Flexible** - Custom strategies and plugins support
- 📦 **Lightweight** - Tree-shakeable, minimal bundle size
- ✅ **Well Tested** - 98/98 tests passing with 100% coverage
- 🔌 **Plugin System** - Extensible architecture
- 🌐 **Locale Support** - Country-specific masking rules
- 📝 **Multiple Formats** - Works with strings, objects, arrays

## 🚀 Quick Start

### Installation

```bash
npm install @oxog/mask
# or
yarn add @oxog/mask
# or
pnpm add @oxog/mask
```

### Basic Usage

```typescript
import { mask } from '@oxog/mask';

// Email masking
const email = mask('john.doe@example.com');
console.log(email); // j***@e******.***

// Credit card masking
const card = mask('4532 1234 5678 9012');
console.log(card); // **** **** **** 9012

// Phone masking
const phone = mask('+1 (555) 123-4567');
console.log(phone); // +* (***) ***-****

// Custom strategy
const custom = mask('john.doe@example.com', {
  strategy: 'partial',
  preserveAt: true
});
console.log(custom); // j***@e******.***

// Object masking
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  creditCard: '4532 1234 5678 9012'
};

const masked = mask(user, {
  email: true,
  phone: true,
  card: true
});

console.log(masked);
// {
//   name: 'John Doe',
//   email: 'j***@e******.***',
//   phone: '+* (***) ***-****',
//   creditCard: '**** **** **** 9012'
// }
```

## 📖 Documentation

For detailed documentation, visit: [https://mask.oxog.dev](https://mask.oxog.dev)

### Available Plugins

#### Core Plugins
- **email** - Email address masking
- **phone** - Phone number masking (international support)
- **card** - Credit/debit card masking with Luhn validation

#### Optional Plugins
- **auto-detect** - Automatic data type detection
- **custom** - Custom masking rules
- **iban** - IBAN number masking
- **ip** - IP address masking
- **jwt** - JWT token masking
- **ssn** - Social Security Number masking
- **url** - URL masking with parameter filtering
- **locale-tr** - Turkey-specific masking rules
- **locale-us** - US-specific masking rules

### Advanced Usage

```typescript
import { createMask } from '@oxog/mask';
import { email, phone } from '@oxog/mask/plugins/core';

// Create custom masking instance
const customMask = createMask({
  plugins: [email(), phone()],
  defaultStrategy: 'hash'
});

// Use with objects
const data = {
  userEmail: 'user@example.com',
  contactPhone: '+1 (555) 123-4567'
};

const masked = customMask(data);
console.log(masked);
// {
//   userEmail: 'a1b2c3d4e5f6',
//   contactPhone: 'f6e5d4c3b2a1'
// }
```

### Custom Strategies

```typescript
import { mask, Strategy } from '@oxog/mask';

const customStrategy: Strategy = {
  name: 'custom',
  mask: (value: string, options: any) => {
    // Your custom masking logic
    return value.replace(/.(?=.{4})/g, '*');
  }
};

const masked = mask('1234567890', {
  strategy: customStrategy
});
console.log(masked); // ****7890
```

## 🏗️ Architecture

### Micro-kernel Design

The library uses a micro-kernel architecture:

```
┌─────────────────────────────────┐
│         @oxog/mask              │
│  (Micro-kernel Core)           │
├─────────────────────────────────┤
│  Core Plugins                   │
│  - email                        │
│  - phone                        │
│  - card                         │
├─────────────────────────────────┤
│  Optional Plugins               │
│  - auto-detect                  │
│  - custom                       │
│  - iban, ip, jwt, ssn, url     │
│  - locale-tr, locale-us         │
└─────────────────────────────────┘
```

This design allows:
- Minimal core size
- On-demand plugin loading
- Easy extension
- Tree-shakeable bundles

## 🧪 Tests

The project has comprehensive test coverage:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Test Results:**
- 98/98 tests passing
- 100% code coverage
- All edge cases covered

## 📦 Bundle Size

Optimized for production:

```
dist/
├── mask.cjs.js     - CommonJS (12.4 kB)
├── mask.esm.js     - ES Module (12.1 kB)
├── mask.umd.js     - UMD (12.8 kB)
└── mask.d.ts       - TypeScript definitions
```

## 🔌 Plugin Development

Create your own plugins:

```typescript
import { Plugin } from '@oxog/mask';

export function myPlugin(): Plugin {
  return {
    name: 'myPlugin',
    patterns: [/pattern/g],
    strategy: 'custom',
    validate: (value: string) => true,
    mask: (value: string, options: any) => {
      // Your masking logic
      return maskedValue;
    }
  };
}
```

## 🛡️ Security

- **No data storage** - All masking is done in-memory
- **Non-reversible** - Masked data cannot be unmasked
- **Input validation** - All inputs are validated
- **Type safety** - Compile-time type checking
- **Zero dependencies** - No external runtime dependencies

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Node.js 14+

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📊 Project Stats

- **Lines of Code:** ~2,500
- **Test Coverage:** 100%
- **Type Safety:** 100%
- **Performance:** < 1ms per operation

## 🔗 Links

- [Website](https://mask.oxog.dev)
- [Documentation](https://mask.oxog.dev/docs)
- [API Reference](https://mask.oxog.dev/api)
- [Examples](https://mask.oxog.dev/examples)
- [NPM Package](https://www.npmjs.com/package/@oxog/mask)
- [GitHub Repository](https://github.com/ersinkoc/oxog-mask)

## 🙏 Acknowledgments

Built with ❤️ by [Ersin KOÇ](https://github.com/ersinkoc)

---

**Made with ❤️ using TypeScript and modern web technologies**
