# @oxog/mask - Zero-Dependency NPM Package

## Package Identity

| Field | Value |
|-------|-------|
| **NPM Package** | `@oxog/mask` |
| **GitHub Repository** | `https://github.com/ersinkoc/mask` |
| **Documentation Site** | `https://mask.oxog.dev` |
| **License** | MIT |
| **Author** | Ersin Koç (ersinkoc) |

> **NO social media, Discord, email, or external links allowed.**

---

## Package Description

**One-line:** Zero-dependency data masking with plugin architecture

Universal data masking library for protecting PII (Personally Identifiable Information) in logs, API responses, database exports, and UI displays. Features a micro-kernel architecture with pluggable maskers for email, phone, credit card, and custom patterns. Supports multiple masking strategies, output formats, auto-detection of sensitive fields, and locale-aware formatting.

---

## NON-NEGOTIABLE RULES

These rules are **ABSOLUTE** and must be followed without exception.

### 1. ZERO RUNTIME DEPENDENCIES

```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```

- Implement EVERYTHING from scratch
- No lodash, no axios, no moment - nothing
- Write your own utilities, parsers, validators
- If you think you need a dependency, you don't

**Allowed devDependencies only:**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "tsup": "^8.0.0",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0"
  }
}
```

### 2. 100% TEST COVERAGE

- Every line of code must be tested
- Every branch must be tested
- Every function must be tested
- **All tests must pass** (100% success rate)
- Use Vitest for testing
- Coverage thresholds enforced in config

### 3. MICRO-KERNEL ARCHITECTURE

All packages MUST use plugin-based architecture:

```
┌─────────────────────────────────────────────────────────┐
│                      User Code                          │
│  mask.email() · mask(obj) · mask.use(plugin)           │
├─────────────────────────────────────────────────────────┤
│                   Plugin Registry                        │
│        use() · register() · unregister() · list()       │
├──────────┬──────────┬──────────┬────────────────────────┤
│  email   │  phone   │   card   │  iban · ip · jwt ...   │
│  (core)  │  (core)  │  (core)  │      (optional)        │
├──────────┴──────────┴──────────┴────────────────────────┤
│                    Micro Kernel                          │
│  Object Traversal · Pattern Matching · Strategy Engine  │
└─────────────────────────────────────────────────────────┘
```

**Kernel responsibilities (minimal):**
- Plugin registration and lifecycle
- Object traversal engine (deep nested objects)
- Pattern matching for field names
- Masking strategy engine
- Configuration management

### 4. DEVELOPMENT WORKFLOW

Create these documents **FIRST**, before any code:

1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions  
3. **TASKS.md** - Ordered task list with dependencies

Only after all three documents are complete, implement code following TASKS.md sequentially.

### 5. TYPESCRIPT STRICT MODE

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

### 6. LLM-NATIVE DESIGN

Package must be designed for both humans AND AI assistants:

- **llms.txt** file in root (< 2000 tokens)
- **Predictable API** naming (`mask`, `use`, `create`, `unregister`)
- **Rich JSDoc** with @example on every public API
- **15+ examples** organized by category
- **README** optimized for LLM consumption

### 7. NO EXTERNAL LINKS

- ✅ GitHub repository URL
- ✅ Custom domain (mask.oxog.dev)
- ✅ npm package URL
- ❌ Social media (Twitter, LinkedIn, etc.)
- ❌ Discord servers or chat links
- ❌ Email addresses
- ❌ Donation links or sponsorship

---

## CORE FEATURES

### 1. Primitive Masking

Mask individual values with type-specific maskers.

**API Example:**
```typescript
import { mask } from '@oxog/mask';

mask.email("ersin@oxog.dev")           // → "e***n@o***.dev"
mask.phone("+905551234567")            // → "+90*****4567"
mask.card("4532015112830366")          // → "**** **** **** 0366"
```

### 2. Object Masking

Deep traverse objects and mask fields by configuration.

**API Example:**
```typescript
import { mask } from '@oxog/mask';

const user = {
  name: "Ersin Koç",
  email: "ersin@oxog.dev",
  phone: "+905551234567",
  address: {
    street: "123 Main St",
    creditCard: "4532015112830366"
  }
};

const masked = mask(user, {
  fields: {
    email: 'email',
    phone: 'phone',
    'address.creditCard': 'card'
  }
});
// → { name: "Ersin Koç", email: "e***n@o***.dev", phone: "+90*****4567", address: { street: "123 Main St", creditCard: "**** **** **** 0366" } }
```

### 3. Masking Strategies

Multiple strategies for controlling what parts of the value are visible.

**API Example:**
```typescript
import { mask } from '@oxog/mask';

// Show first N characters
mask.pattern("ABCDEFGHIJ", { show: 'first:3' })    // → "ABC*******"

// Show last N characters
mask.pattern("ABCDEFGHIJ", { show: 'last:4' })     // → "******GHIJ"

// Show first and last (middle hidden)
mask.pattern("ABCDEFGHIJ", { show: 'middle' })     // → "A********J"

// Full masking
mask.pattern("ABCDEFGHIJ", { show: 'full' })       // → "**********"

// Partial (percentage-based)
mask.pattern("ABCDEFGHIJ", { show: 'partial:0.5' }) // → "ABCDE*****"
```

### 4. Output Formats

Different output formats for different use cases.

**API Example:**
```typescript
import { mask } from '@oxog/mask';

// Display format (for UI)
mask.card("4532015112830366", { format: 'display' })  // → "**** **** **** 0366"

// Compact format (for storage)
mask.card("4532015112830366", { format: 'compact' })  // → "************0366"

// Log format (for structured logging)
mask.card("4532015112830366", { format: 'log' })      // → "[REDACTED:card]"
```

### 5. Custom Masking Character

Configure the character used for masking.

**API Example:**
```typescript
import { mask } from '@oxog/mask';

mask.email("ersin@oxog.dev", { char: '•' })  // → "e•••n@o•••.dev"
mask.email("ersin@oxog.dev", { char: '█' })  // → "e███n@o███.dev"
mask.email("ersin@oxog.dev", { char: 'X' })  // → "eXXXn@oXXX.dev"
```

### 6. Factory Function

Create isolated mask instances with custom configuration.

**API Example:**
```typescript
import { createMask } from '@oxog/mask';
import { iban } from '@oxog/mask/plugins/iban';
import { trLocale } from '@oxog/mask/plugins/locale-tr';

const customMask = createMask({
  char: '•',
  defaultStrategy: 'middle'
})
  .use(iban())
  .use(trLocale());

customMask.iban("TR330006100519786457841326")  // → "TR33••••••••••••••1326"
```

---

## PLUGIN SYSTEM

### Plugin Interface

```typescript
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
```

### Core Plugins (Always Loaded)

| Plugin | Description |
|--------|-------------|
| `email` | Email address masking with domain preservation |
| `phone` | Phone number masking with country code handling |
| `card` | Credit/debit card masking with format preservation |

### Optional Plugins (Opt-in)

| Plugin | Description | Enable |
|--------|-------------|--------|
| `iban` | IBAN bank account masking | `mask.use(iban())` |
| `ip` | IPv4 and IPv6 address masking | `mask.use(ip())` |
| `jwt` | JWT token masking (header.payload.signature) | `mask.use(jwt())` |
| `ssn` | Social security number masking | `mask.use(ssn())` |
| `url` | URL credentials and query params masking | `mask.use(url())` |
| `auto-detect` | Automatic field type detection by name | `mask.use(autoDetect())` |
| `locale-tr` | Turkish locale formatting | `mask.use(trLocale())` |
| `locale-us` | US locale formatting | `mask.use(usLocale())` |
| `custom` | Custom regex-based patterns | `mask.use(custom(config))` |

---

## API DESIGN

### Main Export

```typescript
import { mask, createMask } from '@oxog/mask';

// === PRIMITIVE MASKING ===

// Email masking
mask.email("test@example.com")
// → "t***t@e***.com"

mask.email("test@example.com", { 
  strategy: 'first:2',
  format: 'log' 
})
// → "[REDACTED:email]"

// Phone masking
mask.phone("+15551234567")
// → "+1*****4567"

mask.phone("+15551234567", { strategy: 'last:4' })
// → "*******4567"

// Card masking
mask.card("4532015112830366")
// → "**** **** **** 0366"

mask.card("4532015112830366", { format: 'compact' })
// → "************0366"

// Pattern masking (generic)
mask.pattern("ABC123XYZ", { 
  show: 'last:3',
  char: '•'
})
// → "••••••XYZ"


// === OBJECT MASKING ===

const user = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+15551234567",
  payment: {
    cardNumber: "4532015112830366"
  }
};

// With explicit field mapping
mask(user, {
  fields: {
    email: 'email',
    phone: 'phone',
    'payment.cardNumber': 'card'
  }
});

// With auto-detection (optional plugin)
import { autoDetect } from '@oxog/mask/plugins/auto-detect';
mask.use(autoDetect());
mask(user); // Auto-detects fields by name


// === FACTORY FUNCTION ===

const customMask = createMask({
  char: '•',
  defaultFormat: 'display',
  defaultStrategy: 'middle'
});

customMask.email("test@example.com")
// → "t•••t@e•••.com"


// === PLUGIN MANAGEMENT ===

mask.use(plugin)           // Register a plugin
mask.unregister('plugin')  // Remove a plugin
mask.list()                // List all registered plugins
mask.has('plugin')         // Check if plugin exists
```

### Type Definitions

```typescript
/**
 * Masking strategy options.
 * Controls which parts of the value remain visible.
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
 */
export type MaskFormat = 
  | 'display'                 // Human-readable: "**** **** **** 1234"
  | 'compact'                 // No spaces: "************1234"
  | 'log';                    // For logging: "[REDACTED:card]"

/**
 * Options for masking operations.
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
 * The main mask instance interface.
 */
export interface MaskInstance {
  // Primitive maskers
  email(value: string, options?: MaskOptions): string;
  phone(value: string, options?: MaskOptions): string;
  card(value: string, options?: MaskOptions): string;
  pattern(value: string, options?: MaskOptions & { show?: MaskStrategy }): string;
  
  // Object masking
  <T extends object>(obj: T, options?: ObjectMaskOptions): T;
  
  // Plugin management
  use(plugin: MaskPlugin): MaskInstance;
  unregister(name: string): boolean;
  list(): string[];
  has(name: string): boolean;
}

/**
 * Factory function type.
 */
export type CreateMask = (config?: MaskConfig) => MaskInstance;
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Universal (Node.js + Browser + Edge) |
| Module Format | ESM + CJS |
| Node.js Version | >= 18 |
| TypeScript Version | >= 5.0 |
| Bundle Size (core) | < 3KB gzipped |
| Bundle Size (all plugins) | < 10KB gzipped |

---

## LLM-NATIVE REQUIREMENTS

### 1. llms.txt File

Create `/llms.txt` in project root (< 2000 tokens):

```markdown
# @oxog/mask

> Zero-dependency data masking with plugin architecture

## Install

```bash
npm install @oxog/mask
```

## Basic Usage

```typescript
import { mask } from '@oxog/mask';

mask.email("ersin@oxog.dev")     // → "e***n@o***.dev"
mask.phone("+905551234567")      // → "+90*****4567"
mask.card("4532015112830366")    // → "**** **** **** 0366"
```

## API Summary

### Kernel
- `mask.email(value, options?)` - Mask email addresses
- `mask.phone(value, options?)` - Mask phone numbers
- `mask.card(value, options?)` - Mask credit cards
- `mask.pattern(value, options?)` - Generic pattern masking
- `mask(object, options?)` - Mask object fields
- `mask.use(plugin)` - Register plugin
- `mask.unregister(name)` - Remove plugin

### Core Plugins
- `email` - Email masking with domain preservation
- `phone` - Phone masking with country code
- `card` - Card masking with format

### Optional Plugins
- `iban` - IBAN bank account masking
- `ip` - IP address masking
- `jwt` - JWT token masking
- `ssn` - Social security number masking
- `url` - URL credentials masking
- `auto-detect` - Auto field detection
- `locale-tr` - Turkish locale
- `locale-us` - US locale

## Strategies

| Strategy | Example | Result |
|----------|---------|--------|
| `first:3` | "ABCDEFGHIJ" | "ABC*******" |
| `last:4` | "ABCDEFGHIJ" | "******GHIJ" |
| `middle` | "ABCDEFGHIJ" | "A********J" |
| `full` | "ABCDEFGHIJ" | "**********" |
| `partial:0.5` | "ABCDEFGHIJ" | "ABCDE*****" |

## Formats

| Format | Example |
|--------|---------|
| `display` | `**** **** **** 0366` |
| `compact` | `************0366` |
| `log` | `[REDACTED:card]` |

## Common Patterns

### Object Masking
```typescript
mask(user, {
  fields: {
    email: 'email',
    phone: 'phone',
    'address.card': 'card'
  }
});
```

### Custom Character
```typescript
mask.email("test@mail.com", { char: '•' })
// → "t•••t@m•••.com"
```

### Factory Instance
```typescript
import { createMask } from '@oxog/mask';
const m = createMask({ char: '•' });
m.email("test@mail.com")
```

## Errors

| Code | Meaning | Solution |
|------|---------|----------|
| `INVALID_VALUE` | Value is not a string | Pass a string value |
| `INVALID_STRATEGY` | Unknown strategy | Use valid strategy name |
| `PLUGIN_NOT_FOUND` | Plugin not registered | Register with mask.use() |
| `INVALID_FIELD_PATH` | Bad dot notation | Check field path syntax |

## Links

- Docs: https://mask.oxog.dev
- GitHub: https://github.com/ersinkoc/mask
```

### 2. API Naming Standards

Use predictable patterns LLMs can infer:

```typescript
// ✅ GOOD - Predictable
mask.email()      // Specific masker
mask.phone()      // Specific masker
mask.card()       // Specific masker
mask.pattern()    // Generic masker
mask.use()        // Register plugin
mask.unregister() // Remove plugin
mask.list()       // List plugins
mask.has()        // Check plugin

// ❌ BAD - Unpredictable
mask.e()          // Abbreviation
mask.m()          // Unclear
mask.process()    // Too generic
mask.handle()     // Meaningless
```

### 3. Example Requirements

Minimum 15 examples organized as:

```
examples/
├── 01-basic/
│   ├── email-masking.ts
│   ├── phone-masking.ts
│   ├── card-masking.ts
│   └── README.md
├── 02-strategies/
│   ├── first-n.ts
│   ├── last-n.ts
│   ├── middle.ts
│   ├── full.ts
│   ├── partial.ts
│   └── README.md
├── 03-formats/
│   ├── display-format.ts
│   ├── compact-format.ts
│   ├── log-format.ts
│   └── README.md
├── 04-objects/
│   ├── simple-object.ts
│   ├── nested-object.ts
│   ├── array-masking.ts
│   └── README.md
├── 05-plugins/
│   ├── using-iban.ts
│   ├── using-auto-detect.ts
│   ├── using-locale.ts
│   ├── custom-plugin.ts
│   └── README.md
├── 06-integrations/
│   ├── with-express.ts
│   ├── with-winston-logger.ts
│   ├── with-react.tsx
│   └── README.md
└── 07-real-world/
    ├── api-response-filter/
    ├── log-sanitizer/
    ├── gdpr-compliance/
    └── README.md
```

---

## PROJECT STRUCTURE

```
mask/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Website deploy only
├── src/
│   ├── index.ts                # Main entry, public exports
│   ├── kernel.ts               # Micro kernel core
│   ├── types.ts                # Type definitions (JSDoc rich!)
│   ├── errors.ts               # Custom error classes
│   ├── strategies.ts           # Masking strategy implementations
│   ├── formats.ts              # Output format implementations
│   ├── traverser.ts            # Object traversal engine
│   ├── utils/
│   │   ├── string.ts           # String utilities
│   │   └── validation.ts       # Input validation
│   └── plugins/
│       ├── index.ts            # Plugin exports
│       ├── core/
│       │   ├── email.ts        # Email masker plugin
│       │   ├── phone.ts        # Phone masker plugin
│       │   └── card.ts         # Card masker plugin
│       └── optional/
│           ├── iban.ts         # IBAN masker plugin
│           ├── ip.ts           # IP masker plugin
│           ├── jwt.ts          # JWT masker plugin
│           ├── ssn.ts          # SSN masker plugin
│           ├── url.ts          # URL masker plugin
│           ├── auto-detect.ts  # Auto-detection plugin
│           ├── locale-tr.ts    # Turkish locale plugin
│           ├── locale-us.ts    # US locale plugin
│           └── custom.ts       # Custom pattern plugin
├── tests/
│   ├── unit/
│   │   ├── kernel.test.ts
│   │   ├── strategies.test.ts
│   │   ├── formats.test.ts
│   │   ├── traverser.test.ts
│   │   └── plugins/
│   │       ├── email.test.ts
│   │       ├── phone.test.ts
│   │       ├── card.test.ts
│   │       └── ...
│   ├── integration/
│   │   ├── object-masking.test.ts
│   │   ├── plugin-lifecycle.test.ts
│   │   └── factory.test.ts
│   └── fixtures/
│       ├── emails.ts
│       ├── phones.ts
│       ├── cards.ts
│       └── objects.ts
├── examples/                   # 15+ organized examples
│   ├── 01-basic/
│   ├── 02-strategies/
│   ├── 03-formats/
│   ├── 04-objects/
│   ├── 05-plugins/
│   ├── 06-integrations/
│   └── 07-real-world/
├── website/                    # React + Vite site → mask.oxog.dev
│   ├── public/
│   │   ├── CNAME               # mask.oxog.dev
│   │   └── llms.txt            # LLM reference (copied from root)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── llms.txt                    # LLM-optimized reference (< 2000 tokens)
├── SPECIFICATION.md            # Package spec (root)
├── IMPLEMENTATION.md           # Architecture design (root)
├── TASKS.md                    # Task breakdown (root)
├── README.md                   # Human + LLM optimized
├── CHANGELOG.md
├── LICENSE
├── package.json                # Keywords optimized for discoverability
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── .gitignore
```

---

## WEBSITE SPECIFICATION

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| Vite | 6.x | Build Tool |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling (CSS-first config) |
| shadcn/ui | latest | UI Components |
| @oxog/codeshine | latest | Syntax Highlighting |
| Lucide React | latest | Icons |
| React Router | 7.x | Routing |

### Required Pages

1. **Landing Page** - Hero, features, install, quick example
2. **Docs** - Getting started, guides, tutorials
3. **API Reference** - All functions, types, options
4. **Examples** - Interactive code examples
5. **Plugins** - Core and optional plugins
6. **Playground** - Live code editor

### Design Requirements

- IDE-style code blocks with macOS traffic lights
- Dark/Light theme toggle (synced with @oxog/codeshine)
- GitHub star button with real count
- Footer: "Made with ❤️ by Ersin KOÇ"
- Links to github.com/ersinkoc/mask
- npm package link
- CNAME: mask.oxog.dev
- Fonts: Inter (body), JetBrains Mono (code)

---

## GITHUB ACTIONS

Single workflow file: `.github/workflows/deploy.yml`

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build package
        run: npm run build
      
      - name: Build website
        working-directory: ./website
        run: |
          npm ci
          npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './website/dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## CONFIG FILES

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'website/',
        'examples/',
        '*.config.*',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
```

### package.json

```json
{
  "name": "@oxog/mask",
  "version": "1.0.0",
  "description": "Zero-dependency data masking with plugin architecture",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./plugins": {
      "import": {
        "types": "./dist/plugins/index.d.ts",
        "default": "./dist/plugins/index.js"
      },
      "require": {
        "types": "./dist/plugins/index.d.cts",
        "default": "./dist/plugins/index.cjs"
      }
    },
    "./plugins/*": {
      "import": {
        "types": "./dist/plugins/*.d.ts",
        "default": "./dist/plugins/*.js"
      },
      "require": {
        "types": "./dist/plugins/*.d.cts",
        "default": "./dist/plugins/*.cjs"
      }
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm run test:coverage"
  },
  "keywords": [
    "mask",
    "masking",
    "redact",
    "pii",
    "gdpr",
    "privacy",
    "sanitize",
    "data-protection",
    "logging",
    "security",
    "zero-dependency",
    "typescript"
  ],
  "author": "Ersin Koç",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ersinkoc/mask.git"
  },
  "bugs": {
    "url": "https://github.com/ersinkoc/mask/issues"
  },
  "homepage": "https://mask.oxog.dev",
  "engines": {
    "node": ">=18"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

---

## ERROR CLASSES

```typescript
/**
 * Base error class for all mask errors.
 * 
 * @example
 * ```typescript
 * throw new MaskError('Invalid input', 'INVALID_VALUE', { value: input });
 * ```
 */
export class MaskError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MaskError';
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/**
 * Error thrown when input validation fails.
 */
export class InvalidValueError extends MaskError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_VALUE', context);
    this.name = 'InvalidValueError';
  }
}

/**
 * Error thrown when an invalid strategy is specified.
 */
export class InvalidStrategyError extends MaskError {
  constructor(strategy: string) {
    super(`Invalid masking strategy: ${strategy}`, 'INVALID_STRATEGY', { strategy });
    this.name = 'InvalidStrategyError';
  }
}

/**
 * Error thrown when a plugin operation fails.
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
 */
export class PluginNotFoundError extends MaskError {
  constructor(pluginName: string) {
    super(`Plugin not found: ${pluginName}`, 'PLUGIN_NOT_FOUND', { pluginName });
    this.name = 'PluginNotFoundError';
  }
}

/**
 * Error thrown when a field path is invalid.
 */
export class InvalidFieldPathError extends MaskError {
  constructor(path: string) {
    super(`Invalid field path: ${path}`, 'INVALID_FIELD_PATH', { path });
    this.name = 'InvalidFieldPathError';
  }
}
```

---

## IMPLEMENTATION CHECKLIST

### Before Starting
- [ ] Create SPECIFICATION.md with complete spec
- [ ] Create IMPLEMENTATION.md with architecture
- [ ] Create TASKS.md with ordered task list
- [ ] All three documents reviewed and complete

### During Implementation
- [ ] Follow TASKS.md sequentially
- [ ] Write tests before or with each feature
- [ ] Maintain 100% coverage throughout
- [ ] JSDoc on every public API with @example
- [ ] Create examples as features are built

### Package Completion
- [ ] All tests passing (100%)
- [ ] Coverage at 100% (lines, branches, functions)
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Package builds without errors

### LLM-Native Completion
- [ ] llms.txt created (< 2000 tokens)
- [ ] llms.txt copied to website/public/
- [ ] README first 500 tokens optimized
- [ ] All public APIs have JSDoc + @example
- [ ] 15+ examples in organized folders
- [ ] package.json has 8-12 keywords
- [ ] API uses standard naming patterns

### Website Completion
- [ ] All pages implemented
- [ ] IDE-style code blocks with @oxog/codeshine
- [ ] Copy buttons working
- [ ] Dark/Light theme toggle
- [ ] CNAME file with mask.oxog.dev
- [ ] Mobile responsive
- [ ] Footer with Ersin Koç, MIT, GitHub only

### Final Verification
- [ ] `npm run build` succeeds
- [ ] `npm run test:coverage` shows 100%
- [ ] Website builds without errors
- [ ] All examples run successfully
- [ ] README is complete and accurate

---

## BEGIN IMPLEMENTATION

Start by creating **SPECIFICATION.md** with the complete package specification based on everything above.

Then create **IMPLEMENTATION.md** with architecture decisions.

Then create **TASKS.md** with ordered, numbered tasks.

Only after all three documents are complete, begin implementing code by following TASKS.md sequentially.

**Remember:**
- This package will be published to npm
- It must be production-ready
- Zero runtime dependencies
- 100% test coverage
- Professionally documented
- LLM-native design
- Beautiful documentation website
