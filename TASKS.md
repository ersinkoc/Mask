# @oxog/mask - Implementation Tasks

## Phase 1: Project Setup & Configuration (Tasks 1-5)

### Task 1: Initialize Project Structure
**Dependencies:** None
**Description:** Create all required directories and configuration files
**Files to Create:**
- `package.json` - NPM package configuration
- `tsconfig.json` - TypeScript configuration
- `tsup.config.ts` - Build tool configuration
- `vitest.config.ts` - Test configuration
- `.gitignore` - Git ignore rules
- `LICENSE` - MIT license file
- Directory structure:
  - `src/` - Source code
  - `src/utils/` - Utility modules
  - `src/plugins/` - Plugin modules
  - `src/plugins/core/` - Core plugins
  - `src/plugins/optional/` - Optional plugins
  - `tests/` - Test files
  - `tests/unit/` - Unit tests
  - `tests/integration/` - Integration tests
  - `tests/fixtures/` - Test fixtures
  - `examples/` - Example code
  - `website/` - Documentation website

**Status:** ⏳ Pending

---

### Task 2: Create Type Definitions
**Dependencies:** Task 1
**Description:** Create comprehensive TypeScript type definitions with JSDoc
**Files to Create:**
- `src/types.ts` - All public type definitions
  - MaskStrategy type
  - MaskFormat type
  - MaskOptions interface
  - ObjectMaskOptions interface
  - FieldMapping type
  - MaskConfig interface
  - MaskInstance interface
  - CreateMask type
  - MaskPlugin interface with generics
  - MaskKernel interface with generics
  - All error class types

**JSDoc Requirements:**
- Every public API must have JSDoc
- Include @example tags with code
- Include @default values
- Include @since tags
- Include parameter descriptions
- Include return type descriptions

**Status:** ⏳ Pending

---

### Task 3: Create Error Classes
**Dependencies:** Task 2
**Description:** Implement all custom error classes
**Files to Create:**
- `src/errors.ts` - Error class implementations
  - MaskError (base class)
  - InvalidValueError
  - InvalidStrategyError
  - PluginError
  - PluginNotFoundError
  - InvalidFieldPathError

**Requirements:**
- All errors extend Error
- Include error code
- Include context object
- Error.captureStackTrace support
- Proper TypeScript types

**Status:** ⏳ Pending

---

### Task 4: Create Utility Modules
**Dependencies:** Task 2, Task 3
**Description:** Implement utility functions without external dependencies
**Files to Create:**
- `src/utils/string.ts` - String utilities
  - isString() - Type check
  - pad() - Pad string to length
  - truncate() - Truncate with ellipsis
  - repeat() - Repeat character N times
  - byteLength() - UTF-8 byte length

- `src/utils/validation.ts` - Validation utilities
  - isValidEmail() - Email format validation
  - isValidPhone() - Phone format validation
  - isValidCard() - Luhn algorithm for cards
  - isValidIBAN() - IBAN validation
  - isValidIP() - IP address validation

**Requirements:**
- Zero external dependencies
- Pure functions
- 100% test coverage
- JSDoc documentation

**Status:** ⏳ Pending

---

### Task 5: Implement Strategy Engine
**Dependencies:** Task 2, Task 3, Task 4
**Description:** Implement masking strategy algorithms
**Files to Create:**
- `src/strategies.ts` - Strategy implementations
  - StrategyHandler interface
  - strategies object with all strategy implementations:
    - 'full' - Mask everything
    - 'middle' - Show first and last
    - 'first:N' - Show first N characters
    - 'last:N' - Show last N characters
    - 'partial:N' - Show percentage
  - Strategy validation
  - Strategy application functions

**Algorithm Requirements:**
- Handle edge cases (empty strings, single chars)
- Support Unicode properly
- Efficient implementation
- No external dependencies

**Status:** ⏳ Pending

---

## Phase 2: Core Engine (Tasks 6-8)

### Task 6: Implement Format System
**Dependencies:** Task 5
**Description:** Create output formatting system
**Files to Create:**
- `src/formats.ts` - Format implementations
  - FormatHandler interface
  - formats object:
    - 'display' - Human-readable with spacing
    - 'compact' - No spaces
    - 'log' - Structured logging format
  - Format application functions
  - Locale support hooks

**Requirements:**
- Separate formatting from masking logic
- Support different data types
- Locale-extensible
- Zero dependencies

**Status:** ⏳ Pending

---

### Task 7: Implement Object Traversal Engine
**Dependencies:** Task 2, Task 3, Task 4
**Description:** Create deep object traversal system
**Files to Create:**
- `src/traverser.ts` - Traversal engine
  - Traverse function (DFS algorithm)
  - Circular reference detection
  - Field path resolution (dot notation)
  - Array handling
  - Mixed type handling
  - Path matching logic

**Algorithm Requirements:**
- Depth-first traversal
- Circular reference detection using WeakSet
- Preserve object structure
- Support nested objects and arrays
- Efficient memory usage

**Status:** ⏳ Pending

---

### Task 8: Implement Micro-Kernel
**Dependencies:** Task 2, Task 3, Task 5, Task 6, Task 7
**Description:** Create the core micro-kernel system
**Files to Create:**
- `src/kernel.ts` - Kernel implementation
  - MaskKernel class with:
    - Plugin registry (Map)
    - Masker registry (Map)
    - Plugin lifecycle management
    - Plugin registration/unregistration
    - Plugin lookup
    - Masker registration/execution
    - Shared context management
    - Error propagation
    - Dependency resolution

**Requirements:**
- Generic context support
- Plugin isolation
- Error containment
- Thread-safe operations
- Proper cleanup

**Status:** ⏳ Pending

---

## Phase 3: Core Plugins (Tasks 9-11)

### Task 9: Implement Email Plugin
**Dependencies:** Task 8
**Description:** Create email masking plugin
**Files to Create:**
- `src/plugins/core/email.ts` - Email plugin
  - Email masker implementation
  - Email format validation
  - Local part masking logic
  - Domain preservation
  - Strategy application
  - Format application

**Features:**
- Support all strategies
- Support all formats
- Custom masking character
- Edge case handling (very short emails, special chars)

**Tests Required:**
- Basic masking
- All strategies
- All formats
- Custom character
- Edge cases
- Invalid inputs

**Status:** ⏳ Pending

---

### Task 10: Implement Phone Plugin
**Dependencies:** Task 8
**Description:** Create phone number masking plugin
**Files to Create:**
- `src/plugins/core/phone.ts` - Phone plugin
  - Phone masker implementation
  - Phone format validation
  - Country code handling
  - Number extraction
  - Strategy application
  - Format application

**Features:**
- Support international numbers
- Preserve country codes
- Extract digits only
- Support all strategies
- Support all formats

**Tests Required:**
- International numbers
- Various formats
- All strategies
- All formats
- Edge cases

**Status:** ⏳ Pending

---

### Task 11: Implement Card Plugin
**Dependencies:** Task 8
**Description:** Create credit card masking plugin
**Files to Create:**
- `src/plugins/core/card.ts` - Card plugin
  - Card masker implementation
  - Luhn algorithm validation
  - Format preservation
  - Last 4 digits logic
  - Strategy application
  - Format application

**Features:**
- Luhn validation
- Preserve card format
- Support spaces and dashes
- Show last 4 by default
- Support all strategies

**Tests Required:**
- Valid cards
- Invalid cards
- Different formats
- All strategies
- All formats
- Edge cases

**Status:** ⏳ Pending

---

## Phase 4: Optional Plugins (Tasks 12-20)

### Task 12: Implement IBAN Plugin
**Dependencies:** Task 8
**Description:** Create IBAN masking plugin
**Files to Create:**
- `src/plugins/optional/iban.ts` - IBAN plugin
  - IBAN masker implementation
  - IBAN validation
  - Country code preservation
  - Format grouping

**Features:**
- IBAN validation
- Country code handling
- Grouping preservation

**Tests Required:**
- Valid IBANs
- Invalid IBANs
- Different countries
- Format preservation

**Status:** ⏳ Pending

---

### Task 13: Implement IP Plugin
**Dependencies:** Task 8
**Description:** Create IP address masking plugin
**Files to Create:**
- `src/plugins/optional/ip.ts` - IP plugin
  - IPv4 masker
  - IPv6 masker
  - IP validation
  - Partial masking support

**Features:**
- IPv4 and IPv6 support
- Validation
- Partial masking options

**Tests Required:**
- IPv4 addresses
- IPv6 addresses
- Invalid IPs
- Various masking options

**Status:** ⏳ Pending

---

### Task 14: Implement JWT Plugin
**Dependencies:** Task 8
**Description:** Create JWT token masking plugin
**Files to Create:**
- `src/plugins/optional/jwt.ts` - JWT plugin
  - JWT parser
  - Header masking
  - Payload masking
  - Signature masking
  - Format preservation

**Features:**
- JWT structure parsing
- Selective part masking
- Format preservation

**Tests Required:**
- Valid JWTs
- Invalid JWTs
- Different masking options
- Structure preservation

**Status:** ⏳ Pending

---

### Task 15: Implement SSN Plugin
**Dependencies:** Task 8
**Description:** Create Social Security Number masking plugin
**Files to Create:**
- `src/plugins/optional/ssn.ts` - SSN plugin
  - SSN masker
  - SSN validation
  - Format preservation
  - US format support

**Features:**
- US SSN validation
- Format preservation
- Multiple masking strategies

**Tests Required:**
- Valid SSNs
- Invalid SSNs
- Format variations
- All strategies

**Status:** ⏳ Pending

---

### Task 16: Implement URL Plugin
**Dependencies:** Task 8
**Description:** Create URL masking plugin
**Files to Create:**
- `src/plugins/optional/url.ts` - URL plugin
  - URL parser
  - Query param masking
  - Credential masking
  - Fragment masking

**Features:**
- Query parameter masking
- Credential masking
- Selective part masking

**Tests Required:**
- URLs with query params
- URLs with credentials
- Various formats
- Selective masking

**Status:** ⏳ Pending

---

### Task 17: Implement Auto-Detect Plugin
**Dependencies:** Task 8
**Description:** Create automatic field detection plugin
**Files to Create:**
- `src/plugins/optional/auto-detect.ts` - Auto-detect plugin
  - Field name patterns
  - Pattern matching logic
  - Auto-detection rules
  - Confidence scoring

**Features:**
- Field name pattern matching
- Common PII field detection
- Configurable rules

**Tests Required:**
- Various field names
- Pattern matching
- False positives/negatives
- Configuration options

**Status:** ⏳ Pending

---

### Task 18: Implement Locale Plugins
**Dependencies:** Task 8
**Description:** Create Turkish and US locale plugins
**Files to Create:**
- `src/plugins/optional/locale-tr.ts` - Turkish locale
  - Turkish phone format
  - Turkish name format
  - Turkish address format

- `src/plugins/optional/locale-us.ts` - US locale
  - US phone format
  - US SSN format
  - US address format

**Features:**
- Locale-specific formatting
- Country-specific validation

**Tests Required:**
- Turkish formats
- US formats
- Locale-specific rules

**Status:** ⏳ Pending

---

### Task 19: Implement Custom Plugin
**Dependencies:** Task 8
**Description:** Create custom pattern plugin
**Files to Create:**
- `src/plugins/optional/custom.ts` - Custom plugin
  - Custom regex patterns
  - Pattern registration
  - Custom masker creation

**Features:**
- User-defined patterns
- Regex support
- Custom masker creation

**Tests Required:**
- Custom patterns
- Regex matching
- Edge cases

**Status:** ⏳ Pending

---

### Task 20: Create Plugin Index
**Dependencies:** Tasks 9-19
**Description:** Export all plugins
**Files to Create:**
- `src/plugins/index.ts` - Plugin exports
  - Core plugin exports (email, phone, card)
  - Optional plugin exports (all)
  - Plugin factory functions
  - Plugin type definitions

**Status:** ⏳ Pending

---

## Phase 5: Main API & Factory (Tasks 21-22)

### Task 21: Implement Main API
**Dependencies:** Task 8, Task 20
**Description:** Create the main mask API
**Files to Create:**
- `src/index.ts` - Main API
  - Default mask instance (with core plugins)
  - CreateMask factory function
  - Public exports
  - Plugin integration

**API Methods:**
- mask.email()
- mask.phone()
- mask.card()
- mask.pattern()
- mask() for objects
- mask.use()
- mask.unregister()
- mask.list()
- mask.has()

**Status:** ⏳ Pending

---

### Task 22: Create Factory System
**Dependencies:** Task 21
**Description:** Implement isolated mask instances
**Files to Create:**
- Extend `src/index.ts` with factory
  - createMask() function
  - MaskInstance class
  - Configuration handling
  - Plugin loading on creation

**Features:**
- Custom default configuration
- Plugin pre-loading
- Isolated instances
- Type-safe configuration

**Tests Required:**
- Custom configuration
- Plugin loading
- Instance isolation
- Configuration merging

**Status:** ⏳ Pending

---

## Phase 6: Testing (Tasks 23-29)

### Task 23: Create Test Fixtures
**Dependencies:** None
**Description:** Create test data fixtures
**Files to Create:**
- `tests/fixtures/emails.ts` - Email test data
- `tests/fixtures/phones.ts` - Phone test data
- `tests/fixtures/cards.ts` - Card test data
- `tests/fixtures/objects.ts` - Object test data

**Status:** ⏳ Pending

---

### Task 24: Test Utility Modules
**Dependencies:** Task 4, Task 23
**Description:** Test utility functions
**Files to Create:**
- `tests/unit/utils/string.test.ts` - String utils tests
- `tests/unit/utils/validation.test.ts` - Validation tests

**Coverage Requirements:**
- 100% line coverage
- 100% branch coverage
- All edge cases

**Status:** ⏳ Pending

---

### Task 25: Test Strategies and Formats
**Dependencies:** Task 5, Task 6, Task 23
**Description:** Test strategy and format implementations
**Files to Create:**
- `tests/unit/strategies.test.ts` - Strategy tests
- `tests/unit/formats.test.ts` - Format tests

**Status:** ⏳ Pending

---

### Task 26: Test Kernel
**Dependencies:** Task 8, Task 24
**Description:** Test kernel functionality
**Files to Create:**
- `tests/unit/kernel.test.ts` - Kernel tests
  - Plugin registration
  - Plugin lifecycle
  - Error handling
  - Context management

**Status:** ⏳ Pending

---

### Task 27: Test Traverser
**Dependencies:** Task 7, Task 23
**Description:** Test object traversal
**Files to Create:**
- `tests/unit/traverser.test.ts` - Traversal tests
  - Simple objects
  - Nested objects
  - Arrays
  - Circular references
  - Field paths

**Status:** ⏳ Pending

---

### Task 28: Test Core Plugins
**Dependencies:** Task 9-11, Task 23
**Description:** Test all core plugins
**Files to Create:**
- `tests/unit/plugins/email.test.ts` - Email plugin tests
- `tests/unit/plugins/phone.test.ts` - Phone plugin tests
- `tests/unit/plugins/card.test.ts` - Card plugin tests

**Status:** ⏳ Pending

---

### Task 29: Integration Tests
**Dependencies:** Task 21-28
**Description:** Test complete workflows
**Files to Create:**
- `tests/integration/object-masking.test.ts` - Object masking tests
- `tests/integration/plugin-lifecycle.test.ts` - Plugin lifecycle tests
- `tests/integration/factory.test.ts` - Factory tests
- `tests/integration/api.test.ts` - Full API tests

**Status:** ⏳ Pending

---

## Phase 7: Examples (Tasks 30-38)

### Task 30: Create Basic Examples
**Dependencies:** Task 21
**Description:** Create basic usage examples
**Files to Create:**
- `examples/01-basic/email-masking.ts` - Email examples
- `examples/01-basic/phone-masking.ts` - Phone examples
- `examples/01-basic/card-masking.ts` - Card examples
- `examples/01-basic/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 31: Create Strategy Examples
**Dependencies:** Task 21
**Description:** Create masking strategy examples
**Files to Create:**
- `examples/02-strategies/first-n.ts` - First N examples
- `examples/02-strategies/last-n.ts` - Last N examples
- `examples/02-strategies/middle.ts` - Middle examples
- `examples/02-strategies/full.ts` - Full masking examples
- `examples/02-strategies/partial.ts` - Partial examples
- `examples/02-strategies/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 32: Create Format Examples
**Dependencies:** Task 21
**Description:** Create format examples
**Files to Create:**
- `examples/03-formats/display-format.ts` - Display format examples
- `examples/03-formats/compact-format.ts` - Compact format examples
- `examples/03-formats/log-format.ts` - Log format examples
- `examples/03-formats/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 33: Create Object Examples
**Dependencies:** Task 21
**Description:** Create object masking examples
**Files to Create:**
- `examples/04-objects/simple-object.ts` - Simple object examples
- `examples/04-objects/nested-object.ts` - Nested object examples
- `examples/04-objects/array-masking.ts` - Array examples
- `examples/04-objects/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 34: Create Plugin Examples
**Dependencies:** Task 21
**Description:** Create plugin usage examples
**Files to Create:**
- `examples/05-plugins/using-iban.ts` - IBAN plugin examples
- `examples/05-plugins/using-auto-detect.ts` - Auto-detect examples
- `examples/05-plugins/using-locale.ts` - Locale plugin examples
- `examples/05-plugins/custom-plugin.ts` - Custom plugin examples
- `examples/05-plugins/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 35: Create Integration Examples
**Dependencies:** Task 21
**Description:** Create integration examples
**Files to Create:**
- `examples/06-integrations/with-express.ts` - Express integration
- `examples/06-integrations/with-winston-logger.ts` - Winston logger
- `examples/06-integrations/with-react.tsx` - React integration
- `examples/06-integrations/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 36: Create Real-World Examples
**Dependencies:** Task 21
**Description:** Create real-world use case examples
**Files to Create:**
- `examples/07-real-world/api-response-filter/` - API filter examples
- `examples/07-real-world/log-sanitizer/` - Log sanitization examples
- `examples/07-real-world/gdpr-compliance/` - GDPR compliance examples
- `examples/07-real-world/README.md` - Documentation

**Status:** ⏳ Pending

---

### Task 37: Create Example Documentation
**Dependencies:** Task 30-36
**Description:** Create comprehensive example documentation
**Files to Create:**
- `examples/README.md` - Main examples index
- All subdirectory README.md files
- Code comments and documentation

**Status:** ⏳ Pending

---

### Task 38: Verify Examples
**Dependencies:** Task 30-37
**Description:** Ensure all examples run successfully
**Actions:**
- Run all examples
- Verify output matches expectations
- Fix any issues
- Update documentation

**Status:** ⏳ Pending

---

## Phase 8: Documentation (Tasks 39-42)

### Task 39: Create llms.txt
**Dependencies:** Task 21
**Description:** Create LLM-optimized reference file
**Files to Create:**
- `llms.txt` - LLM reference (< 2000 tokens)
  - Install instructions
  - Basic usage
  - API summary
  - Plugin list
  - Strategies table
  - Formats table
  - Common patterns
  - Error codes

**Status:** ⏳ Pending

---

### Task 40: Create README
**Dependencies:** Task 21
**Description:** Create main README.md
**Files to Create:**
- `README.md` - Main documentation
  - Badges (npm, license, tests)
  - Install section
  - Quick start
  - Core features
  - API reference
  - Examples
  - Plugin documentation
  - Contributing
  - License

**Status:** ⏳ Pending

---

### Task 41: Create CHANGELOG
**Dependencies:** None
**Description:** Create version changelog
**Files to Create:**
- `CHANGELOG.md` - Version history
  - Version 1.0.0
  - All features
  - Breaking changes (none)
  - Bug fixes

**Status:** ⏳ Pending

---

### Task 42: Website Setup
**Dependencies:** Task 39-40
**Description:** Build documentation website
**Files to Create:**
- `website/` - React + Vite site
  - `package.json` - Website dependencies
  - `vite.config.ts` - Vite configuration
  - `public/llms.txt` - Copy from root
  - `public/CNAME` - mask.oxog.dev
  - Source files for:
    - Landing page
    - Documentation
    - API reference
    - Examples
    - Playground

**Status:** ⏳ Pending

---

## Phase 9: Finalization (Tasks 43-46)

### Task 43: Final Testing
**Dependencies:** Task 29
**Description:** Run full test suite
**Actions:**
- Run `npm run test:coverage`
- Verify 100% coverage
- Fix any failing tests
- Verify all edge cases

**Success Criteria:**
- All tests pass
- Coverage ≥ 100%
- No TypeScript errors

**Status:** ⏳ Pending

---

### Task 44: Build Verification
**Dependencies:** Task 21
**Description:** Verify package builds successfully
**Actions:**
- Run `npm run build`
- Check bundle size
- Verify exports
- Check TypeScript definitions

**Success Criteria:**
- Build succeeds
- Bundle size < 3KB
- All exports present

**Status:** ⏳ Pending

---

### Task 45: Lint and Format
**Dependencies:** Task 21
**Description:** Run linting and formatting
**Actions:**
- Run `npm run lint`
- Run `npm run format`
- Fix any issues
- Update ESLint config if needed

**Success Criteria:**
- No linting errors
- Code formatted
- No warnings

**Status:** ⏳ Pending

---

### Task 46: Final Verification
**Dependencies:** Task 43-45
**Description:** Complete final verification
**Actions:**
- Run all tests
- Build package
- Test examples
- Verify documentation
- Check bundle size
- Verify TypeScript
- Run linting
- Create .gitignore

**Success Criteria:**
- All checks pass
- Package ready for publish

**Status:** ⏳ Pending

---

## Task Dependencies Summary

```
Phase 1: Setup (1-5)
  └─ Phase 2: Core (6-8)
      └─ Phase 3: Core Plugins (9-11)
          └─ Phase 4: Optional Plugins (12-20)
              └─ Phase 5: API & Factory (21-22)
                  └─ Phase 6: Testing (23-29)
                      └─ Phase 7: Examples (30-38)
                          └─ Phase 8: Documentation (39-42)
                              └─ Phase 9: Finalization (43-46)
```

## Parallel Execution Opportunities

Tasks 9-11 (Core Plugins) can be done in parallel after Task 8.

Tasks 12-19 (Optional Plugins) can be done in parallel after Task 8.

Tasks 24-28 (Unit Tests) can be done in parallel after their respective implementations.

Tasks 30-36 (Examples) can be done in parallel after Task 21.

## Estimated Time

- **Total Tasks:** 46
- **Sequential:** ~5-7 days
- **Parallel:** ~3-4 days
- **Testing & Polish:** ~1-2 days

## Success Criteria

✅ All tasks completed
✅ 100% test coverage
✅ Zero runtime dependencies
✅ Bundle size < 3KB
✅ All examples working
✅ Documentation complete
✅ TypeScript strict mode
✅ LLM-native design

---

## Notes

- Each task must be completed before moving to dependent tasks
- Tests should be written alongside or before implementation
- Documentation should be updated as code is written
- All code must follow TypeScript strict mode
- Zero runtime dependencies must be maintained
- Bundle size must be monitored throughout
