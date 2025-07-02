# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run build` - Compile TypeScript to JavaScript in `dist/`
- `npm run dev` - Watch mode for development with auto-rebuild
- `npm test` - Run test suite with Vitest
- `npm run test:coverage` - Run tests with coverage report
- `npm run typecheck` - Type checking without emitting files
- `npm run lint` - ESLint code linting
- `npm run format` - Format code with Prettier

### Testing Commands
- `npm test` - Run all tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `vitest run` - Run tests once without watch mode
- `vitest run --reporter=verbose` - Run tests with detailed output

### Build and Quality Checks
Always run these before committing:
```bash
npm run typecheck && npm run lint && npm test
```

## Architecture Overview

This is a modern TypeScript CLI tool for generating markdown files with templates. The codebase follows **functional programming principles** and **SOLID design patterns**.

### Core Architecture

**Functional Programming Approach:**
- Uses Result monad pattern (`success`/`failure`) for error handling
- Functional composition over imperative loops
- Pure functions with dependency injection
- Immutable data transformations

**Key Architectural Patterns:**
- **Command Pattern**: CLI commands are pure functions accepting dependencies
- **Dependency Injection**: Services are injected rather than hard-coded
- **Service Layer**: Business logic separated from CLI concerns
- **Template Processing Pipeline**: Functional pipeline for template rendering

### Directory Structure

```
src/
├── commands/          # Command handlers (generate, list, init)
├── services/          # Business logic services (template processing)
├── utils/             # Utility functions (functional, date, string, file)
├── types.ts          # TypeScript interfaces and types
├── config.ts         # Configuration loading and validation
├── generator.ts      # Main MarkdownGenerator class
├── prompts.ts        # Interactive prompt handling
└── index.ts          # CLI entry point
```

### Key Components

**MarkdownGenerator Class:**
- Main orchestrator using dependency injection
- Accepts `FileService`, `VariableResolver`, `TemplateRenderer`
- Processes templates through functional pipeline

**Template Processing Pipeline:**
- Pure functions for variable resolution
- Template rendering with interpolation
- File path generation with slugification
- Result monad for error handling

**Command System:**
- Commands are pure functions with dependencies
- Uses `safeCliAction` wrapper for error handling
- Declarative command definitions in `index.ts`

**Configuration System:**
- Uses cosmiconfig for flexible config loading
- Zod schema validation for type safety
- Supports `.js`, `.ts`, `.json` config files

### Functional Programming Patterns

**Result Monad (`src/utils/functional.ts`):**
```typescript
// Always use Result<T, E> for operations that can fail
const result = await asyncTryCatch(someAsyncOperation);
return fold(result, onSuccess, onError);
```

**Dependency Injection:**
```typescript
// Services are injected, not instantiated
const generator = new MarkdownGenerator(
  config,
  fileService,
  variableResolver,
  templateRenderer
);
```

**Function Composition:**
```typescript
// Use functional pipelines over imperative loops
const processTemplate = compose(
  resolveVariables,
  renderTemplate,
  generateFilePath
);
```

## Code Writing Rules

### Functional Programming
- Use Result monad for error handling instead of try-catch
- Prefer pure functions over methods with side effects
- Use function composition over imperative loops
- Apply dependency injection for testability

### Error Handling
- Use `asyncTryCatch` for async operations that can fail
- Use `fold` to handle Result success/failure cases
- Wrap CLI actions with `safeCliAction` for consistent error handling

### Type Safety
- Use Zod schemas for runtime validation
- Define explicit interfaces for all services
- Use strict TypeScript configuration

### Testing
- Write tests for all utility functions
- Mock dependencies using dependency injection
- Test both success and failure cases for Result types

## Configuration

**Config Loading:**
The app uses cosmiconfig to load configuration from:
- `mdg.config.js`
- `mdg.config.ts` 
- `mdg.config.json`
- `.mdgrc` files
- `package.json` (mdg field)

**Template Variables:**
- Built-in variables: `{{date}}`, `{{title}}`, `{{slug}}`, etc.
- Global variables defined in config
- Template-specific variables
- Dynamic variables using functions

**Template Structure:**
```typescript
interface TemplateConfig {
  fileName: string;        // Output filename pattern
  directory: string;       // Output directory
  template: string;        // Template file path
  variables?: Record<string, string | (() => string)>;
  prompts?: Record<string, PromptConfig>;
}
```

## Development Notes

**ES Modules:**
- Uses ES modules (`"type": "module"` in package.json)
- All imports must use `.js` extensions for compiled output
- Use `import` syntax throughout

**Build Process:**
- TypeScript compiled with `tsup`
- Output to `dist/` directory
- Source maps and declarations generated

**Testing:**
- Uses Vitest for testing
- Coverage with v8 provider
- Tests in `tests/` directory mirror `src/` structure