# @oxog/mask - Implementation Architecture

## Architecture Overview

### Micro-Kernel Design Pattern

The package follows a **Micro-Kernel Architecture** with a plugin-based system. This design provides maximum flexibility while maintaining a minimal core footprint.

#### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│              (User Code & Integrations)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Public API Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ mask.email() │  │ mask.phone()│  │ mask.card()  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌────────────────────────────────────────────────────┐ │
│  │            mask(obj, options)                      │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ mask.use()   │  │mask.unregister│  │ mask.list()  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│              Plugin Registry                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  • Plugin Registration & Lifecycle              │  │
│  │  • Dependency Resolution                         │  │
│  │  • Plugin Communication                          │  │
│  │  • Error Handling & Isolation                   │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│                Plugin Layer                             │
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌─────────────────┐  │
│  │ Email │  │ Phone │  │ Card  │  │  Optional       │  │
│  │       │  │       │  │       │  │  Plugins        │  │
│  │       │  │       │  │       │  │  (IBAN, IP,     │  │
│  │ Core  │  │ Core  │  │ Core  │  │   JWT, SSN,     │  │
│  └───────┘  └───────┘  └───────┘  │   URL, etc.)    │  │
│                                     └─────────────────┘  │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│                Kernel Layer                              │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ Traversal   │ │ Pattern      │ │ Strategy Engine  │  │
│  │ Engine      │ │ Matching     │ │                  │  │
│  │             │ │              │ │                  │  │
│  │ • Deep      │ │ • Field Name │ │ • first:N        │  │
│  │   traversal │ │   patterns   │ │ • last:N         │  │
│  │ • Arrays    │ │ • Wildcards  │ │ • middle         │  │
│  │ • Nested    │ │ • Regex      │ │ • full           │  │
│  │   objects   │ │              │ │ • partial:N      │  │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ Config      │ │ Error        │ │ Utilities        │  │
│  │ Management  │ │ Handling     │ │                  │  │
│  │             │ │              │ │ • String utils   │  │
│  │ • Defaults  │ │ • Error      │ │ • Validation    │  │
│  │ • Override  │ │   propagation│ │ • Parsing       │  │
│  │ • Merge     │ │ • Recovery   │ │ • Formatting    │  │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Design Decisions

#### 1. Plugin System Architecture

**Decision:** Use a factory-based plugin registration system with lifecycle hooks.

**Rationale:**
- Allows for lazy loading and dynamic plugin management
- Enables plugin isolation and error containment
- Supports plugin dependencies and initialization order
- Facilitates testing with mock plugins

**Implementation:**
```typescript
interface MaskPlugin<TContext = unknown> {
  name: string;
  version: string;
  dependencies?: string[];
  install: (kernel: MaskKernel<TContext>) => void;
  onInit?: (context: TContext) => void;
  onDestroy?: () => void;
  onError?: (error: Error) => void;
}
```

#### 2. Strategy Engine Pattern

**Decision:** Implement a strategy pattern for masking different parts of values.

**Rationale:**
- Decouples masking logic from specific data types
- Allows composition of strategies
- Makes it easy to add new strategies
- Enables strategy chaining if needed

**Strategies Implemented:**
- `first:N` - Show first N characters
- `last:N` - Show last N characters
- `middle` - Show first and last, hide middle
- `full` - Mask everything
- `partial:N` - Show percentage of value

#### 3. Format System

**Decision:** Separate formatting from masking logic.

**Rationale:**
- Allows multiple output formats for same masked data
- Enables locale-specific formatting
- Supports different use cases (UI, logging, storage)
- Keeps masking logic clean and focused

**Formats:**
- `display` - Human-readable with spacing
- `compact` - No spaces, continuous
- `log` - Structured logging format

#### 4. Object Traversal Algorithm

**Decision:** Use depth-first traversal with circular reference detection.

**Rationale:**
- Handles deeply nested structures efficiently
- Prevents infinite loops on circular references
- Maintains object shape and types
- Supports arrays and mixed structures

**Algorithm:**
```
DFS Traversal:
1. Check if value is primitive → apply masker
2. Check if value is object/array → traverse recursively
3. Check field path against mapping → apply masker
4. Check circular reference → skip or use different approach
5. Preserve non-matching fields
```

#### 5. Type System Design

**Decision:** Use TypeScript with strict mode and discriminated unions.

**Rationale:**
- Provides compile-time safety
- Makes API contracts explicit
- Enables better IDE support
- Prevents runtime errors

**Key Types:**
```typescript
type MaskStrategy = 'full' | 'middle' | `first:${number}` | `last:${number}` | `partial:${number}`;
type MaskFormat = 'display' | 'compact' | 'log';
```

#### 6. Error Handling Strategy

**Decision:** Use typed error classes with context and codes.

**Rationale:**
- Enables precise error handling
- Provides debugging context
- Supports error recovery strategies
- Maintains compatibility with error tracking systems

**Error Hierarchy:**
```
MaskError (base)
  ├── InvalidValueError
  ├── InvalidStrategyError
  ├── PluginError
  ├── PluginNotFoundError
  └── InvalidFieldPathError
```

---

## Core Module Design

### 1. Kernel Module (`kernel.ts`)

**Responsibilities:**
- Plugin registry management
- Plugin lifecycle orchestration
- Shared context management
- Error propagation and isolation

**Key Classes:**
```typescript
class MaskKernel<TContext = unknown> {
  private plugins: Map<string, MaskPlugin> = new Map();
  private maskers: Map<string, MaskerFunction> = new Map();
  private context: TContext;

  registerPlugin(plugin: MaskPlugin<TContext>): void;
  unregisterPlugin(name: string): boolean;
  getPlugin(name: string): MaskPlugin | undefined;
  listPlugins(): string[];
  registerMasker(type: string, masker: MaskerFunction): void;
  getMasker(type: string): MaskerFunction | undefined;
  executeMask(type: string, value: string, options?: MaskOptions): string;
}
```

### 2. Strategy Module (`strategies.ts`)

**Responsibilities:**
- Implement masking strategy algorithms
- Validate strategy parameters
- Apply strategies to values

**Implementation:**
```typescript
interface StrategyHandler {
  (value: string, strategy: MaskStrategy, char: string): string;
}

const strategies: Record<Exclude<MaskStrategy, string>, StrategyHandler> = {
  full: (value, _, char) => char.repeat(value.length),
  middle: (value, _, char) => {
    if (value.length <= 2) return char.repeat(value.length);
    return value[0] + char.repeat(value.length - 2) + value[value.length - 1];
  },
  first: (value, strategy, char) => {
    const n = parseInt(strategy.split(':')[1]);
    return value.substring(0, n) + char.repeat(value.length - n);
  },
  last: (value, strategy, char) => {
    const n = parseInt(strategy.split(':')[1]);
    return char.repeat(value.length - n) + value.substring(value.length - n);
  },
  partial: (value, strategy, char) => {
    const ratio = parseFloat(strategy.split(':')[1]);
    const visible = Math.floor(value.length * ratio);
    return value.substring(0, visible) + char.repeat(value.length - visible);
  }
};
```

### 3. Format Module (`formats.ts`)

**Responsibilities:**
- Apply output formatting
- Handle locale-specific formatting
- Format different data types

**Implementation:**
```typescript
interface FormatHandler {
  (value: string, type: string): string;
}

const formats: Record<MaskFormat, FormatHandler> = {
  display: (value, type) => {
    // Add spacing for cards, preserve structure
    if (type === 'card') {
      return value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    return value;
  },
  compact: (value, type) => {
    // Remove all formatting
    return value.replace(/\s/g, '');
  },
  log: (value, type) => {
    // Return structured log format
    return `[REDACTED:${type}]`;
  }
};
```

### 4. Traverser Module (`traverser.ts`)

**Responsibilities:**
- Deep object traversal
- Array processing
- Circular reference detection
- Field path resolution

**Algorithm:**
```typescript
function traverse<T>(
  obj: T,
  options: ObjectMaskOptions,
  context: TraversalContext
): T {
  // 1. Handle primitives
  if (isPrimitive(obj)) {
    return applyMasking(obj, options);
  }

  // 2. Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => traverse(item, options, context)) as unknown as T;
  }

  // 3. Handle objects
  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    const path = context.currentPath ? `${context.currentPath}.${key}` : key;

    // Check if field should be masked
    const maskerType = findMaskerForField(path, options.fields);
    if (maskerType) {
      result[key] = context.kernel.executeMask(
        maskerType,
        String(value),
        options
      ) as unknown as T[typeof key];
    } else {
      // Recursively traverse nested objects
      if (options.deep && isObject(value)) {
        result[key] = traverse(value, options, {
          ...context,
          currentPath: path
        }) as unknown as T[typeof key];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
```

### 5. Plugin Base Classes

**Email Plugin:**
```typescript
export const emailPlugin: MaskPlugin = {
  name: 'email',
  version: '1.0.0',
  install(kernel) {
    kernel.registerMasker('email', (value: string, options: MaskOptions) => {
      // 1. Validate input
      if (!isValidEmail(value)) {
        throw new InvalidValueError('Invalid email format', { value });
      }

      // 2. Extract parts
      const [localPart, domain] = value.split('@');

      // 3. Apply strategy
      const strategy = options.strategy || 'middle';
      const maskedLocal = applyStrategy(localPart, strategy, options.char || '*');

      // 4. Apply format
      const format = options.format || 'display';
      const formatted = applyFormat(`${maskedLocal}@${domain}`, 'email', format);

      return formatted;
    });
  }
};
```

---

## Plugin Design Patterns

### Core Plugin Pattern

All core plugins follow this pattern:

```typescript
export const pluginName: MaskPlugin = {
  name: 'plugin-name',
  version: '1.0.0',
  install(kernel) {
    kernel.registerMasker('type', maskerFunction);
  }
};
```

### Optional Plugin Pattern

Optional plugins provide extended functionality:

```typescript
export function createOptionalPlugin(config?: PluginConfig): MaskPlugin {
  return {
    name: 'optional-plugin',
    version: '1.0.0',
    dependencies: config?.requires || [],
    install(kernel) {
      // Register maskers
    },
    onInit(context) {
      // Post-installation setup
    }
  };
}
```

### Locale Plugin Pattern

Locale plugins extend formatting:

```typescript
export function createLocalePlugin(locale: string): MaskPlugin {
  return {
    name: `locale-${locale}`,
    version: '1.0.0',
    install(kernel) {
      // Extend format handlers with locale-specific rules
    }
  };
}
```

---

## Utility Modules

### String Utilities (`utils/string.ts`)

```typescript
/** Pad a string to specified length */
export function pad(str: string, length: number, char: string = ' '): string;

/** Truncate string with ellipsis */
export function truncate(str: string, maxLength: number): string;

/** Repeat character N times */
export function repeat(char: string, count: number): string;

/** Get string byte length (UTF-8) */
export function byteLength(str: string): number;
```

### Validation Utilities (`utils/validation.ts`)

```typescript
/** Check if value is a string */
export function isString(value: unknown): value is string;

/** Validate email format */
export function isValidEmail(email: string): boolean;

/** Validate phone number format */
export function isValidPhone(phone: string): boolean;

/** Validate credit card format (Luhn check) */
export function isValidCard(card: string): boolean;

/** Validate IBAN format */
export function isValidIBAN(iban: string): boolean;
```

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/                    # Individual component tests
│   ├── kernel.test.ts
│   ├── strategies.test.ts
│   ├── formats.test.ts
│   ├── traverser.test.ts
│   └── plugins/
│       ├── email.test.ts
│       ├── phone.test.ts
│       ├── card.test.ts
│       └── ...
├── integration/            # Feature integration tests
│   ├── object-masking.test.ts
│   ├── plugin-lifecycle.test.ts
│   └── factory.test.ts
└── fixtures/               # Test data
    ├── emails.ts
    ├── phones.ts
    ├── cards.ts
    └── objects.ts
```

### Coverage Requirements

- **Lines:** 100%
- **Functions:** 100%
- **Branches:** 100%
- **Statements:** 100%

### Test Categories

1. **Unit Tests**
   - Individual strategy implementations
   - Format handlers
   - Utility functions
   - Plugin registration/unregistration

2. **Integration Tests**
   - End-to-end masking workflows
   - Plugin interaction
   - Object traversal scenarios
   - Error propagation

3. **Edge Case Tests**
   - Circular references
   - Empty values
   - Very long strings
   - Special characters
   - Unicode handling

---

## Build Configuration

### tsup Configuration

```typescript
export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false, // Keep readable for debugging
});
```

### TypeScript Configuration

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
    "module": "ESNext",
    "skipLibCheck": true
  }
}
```

### Vitest Configuration

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
});
```

---

## Performance Considerations

### Bundle Size Targets

- **Core package:** < 3KB gzipped
- **All plugins:** < 10KB gzipped

### Optimization Strategies

1. **Tree Shaking**
   - ESM-only exports
   - Side-effect-free modules
   - Dead code elimination

2. **Code Splitting**
   - Core plugins in main bundle
   - Optional plugins as separate chunks
   - Dynamic imports for large plugins

3. **Minimal Runtime**
   - No runtime dependencies
   - Pure functions
   - Efficient algorithms

### Memory Management

- No retained references in plugins
- Immutable data structures
- Proper cleanup on plugin unregister

---

## Security Considerations

### Input Validation

- All inputs validated before processing
- Type checking at runtime
- Sanitization of special characters

### No Code Injection

- No eval() or Function()
- No dynamic code execution
- Safe string handling only

### Privacy Protection

- Original values never stored
- Masked values are one-way
- No logging of sensitive data

---

## Extension Points

### Custom Plugins

Users can create custom plugins:

```typescript
const customPlugin: MaskPlugin = {
  name: 'custom-masker',
  version: '1.0.0',
  install(kernel) {
    kernel.registerMasker('custom', (value, options) => {
      // Custom masking logic
      return maskedValue;
    });
  }
};

mask.use(customPlugin);
```

### Custom Strategies

Strategies can be extended:

```typescript
kernel.registerStrategy('custom-strategy', (value, char) => {
  // Custom strategy implementation
  return maskedValue;
});
```

### Custom Formats

Formats can be extended:

```typescript
kernel.registerFormat('custom-format', (value, type) => {
  // Custom format implementation
  return formattedValue;
});
```

---

## Migration & Versioning

### Semantic Versioning

- **MAJOR:** Breaking API changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (backward compatible)

### Backward Compatibility

- All existing APIs preserved
- Deprecation warnings for future removals
- Migration guides for major versions

### Plugin Versioning

- Plugins versioned independently
- Compatible with specific kernel versions
- Migration paths documented

---

## Deployment Strategy

### Package Publishing

1. Build package: `npm run build`
2. Run tests: `npm run test:coverage`
3. Run linting: `npm run lint`
4. Publish to npm: `npm publish`

### Website Deployment

1. Build website: `cd website && npm run build`
2. Deploy to GitHub Pages
3. Update CNAME to mask.oxog.dev

---

## Documentation Strategy

### API Documentation

- JSDoc on all public APIs
- @example tags with real code
- Type signatures for clarity
- Error documentation

### Guides

- Getting Started
- Core Concepts
- Plugin Development
- Integration Examples
- Best Practices

### Examples

- 15+ real-world examples
- Organized by category
- Executable code samples
- Expected output shown

---

## Conclusion

This architecture provides a solid foundation for a zero-dependency, highly extensible data masking library. The micro-kernel design ensures minimal core size while maximizing flexibility through the plugin system. All components are designed for testability, maintainability, and performance.
