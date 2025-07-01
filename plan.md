# Markdown Generator Modernization Plan

## Overview
Modernize the existing markdown-generator CLI tool while maintaining its core functionality and simplicity.

## Goals
- Keep the same simple functionality (generate markdown files with date interpolation)
- Upgrade to modern TypeScript for better maintainability
- Improve code structure and testing
- Maintain backward compatibility with existing configs

## Implementation Approach
**Start from scratch** - Remove all old files and recreate the entire project from zero. Use the existing codebase only as a reference for functionality. This allows us to:
- Build a clean, modern architecture without legacy constraints
- Implement best practices from the ground up
- Avoid carrying over any technical debt
- Create a more maintainable codebase

## Current Features to Preserve
1. Generate markdown files from templates
2. Date prefix in filenames (e.g., `2021-4-14-blog.md`)
3. Custom templates with frontmatter
4. Configuration via `mdg.config.js`
5. Built-in date attribute support
6. Simple CLI usage: `mdg [filename]`

## New Features to Add
1. **Interactive mode**: When no arguments provided, prompt for:
   - Template selection
   - Title
   - Tags
   - Other frontmatter fields
2. **Multiple template support**: 
   - Define multiple templates in config
   - Select template via CLI argument or interactive prompt
   - Example: `mdg --template blog "My Post"`
3. **Variable interpolation**:
   - Support variables beyond just date
   - Examples: `{{title}}`, `{{author}}`, `{{slug}}`
   - Variables available in both filename and content

## Technology Stack
- **Language**: TypeScript (from JavaScript)
- **Build Tool**: tsup (simple, fast bundler)
- **Testing**: Vitest (modern, fast, TypeScript-native)
- **Package Manager**: npm (keep it simple)
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **CLI Framework**: Commander.js (for better argument parsing)
- **Interactive Prompts**: Inquirer.js (for interactive mode)

## Project Structure
```
markdown-generator/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── generator.ts      # Core markdown generation logic
│   ├── config.ts         # Configuration handling
│   ├── types.ts          # TypeScript interfaces
│   └── utils/
│       ├── file.ts       # File system utilities
│       └── date.ts       # Date formatting utilities
├── templates/
│   └── default.md        # Default template
├── tests/
│   ├── generator.test.ts
│   └── config.test.ts
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Implementation Steps

### Phase 1: Setup
1. **Clean slate**: Remove all old JavaScript files (keep only for reference)
2. Initialize fresh TypeScript project
3. Set up build tooling (tsup)
4. Configure ESLint and Prettier
5. Set up Vitest for testing

### Phase 2: Core Implementation (from scratch)
1. Create new TypeScript implementation of markdown generation
2. Build configuration system with TypeScript
3. Define proper TypeScript interfaces
4. Ensure backward compatibility with old config format

### Phase 3: New Features Implementation
1. Add Commander.js for better CLI parsing
2. Implement interactive mode with Inquirer.js
3. Add multiple template support
4. Implement variable interpolation system
5. Create template selection logic

### Phase 4: Testing
1. Migrate existing tests to Vitest
2. Add tests for new features
3. Add type checking tests
4. Ensure backward compatibility

### Phase 5: Build & Package
1. Set up build pipeline
2. Ensure CLI binary works correctly
3. Test npm package installation

## Configuration Interface
```typescript
interface MdgConfig {
  // Default template config (backward compatible)
  fileName: string
  directory: string
  prefix?: string
  template?: string
  builtinAttribute?: {
    date?: string
  }
  
  // New: Multiple templates support
  templates?: {
    [name: string]: {
      fileName: string
      directory: string
      prefix?: string
      template: string
      variables?: Record<string, string | (() => string)>
      prompts?: {
        [key: string]: {
          type: 'input' | 'list' | 'checkbox'
          message: string
          default?: any
          choices?: string[]
        }
      }
    }
  }
  
  // Global variables available to all templates
  globalVariables?: {
    author?: string
    [key: string]: string | (() => string)
  }
}
```

## Backward Compatibility
- Support existing `mdg.config.js` files
- Keep same CLI command structure
- Maintain same output format
- No breaking changes to existing workflows

## Usage Examples

### Basic Usage (Backward Compatible)
```bash
mdg my-post              # Creates blog/2024-01-01-my-post.md
mdg                      # Interactive mode (new!)
```

### With Templates
```bash
mdg --template blog "My Blog Post"     # Use blog template
mdg --template note                    # Use note template, interactive mode
mdg list                               # List available templates
```

### Interactive Mode
```bash
$ mdg
? Select a template: (Use arrow keys)
❯ blog
  note
  documentation
? Title: My Awesome Post
? Tags: typescript, cli
? Author: shuent
✓ Created: blog/2024-01-01-my-awesome-post.md
```

## Timeline
- Phase 1: ~2 hours
- Phase 2: ~3 hours  
- Phase 3: ~4 hours (new features)
- Phase 4: ~3 hours (expanded testing)
- Phase 5: ~1 hour

Total estimated time: ~13 hours

## Success Criteria
- [ ] All existing functionality works identically
- [ ] TypeScript provides full type safety
- [ ] Tests pass with good coverage
- [ ] Build outputs clean, optimized JavaScript
- [ ] Package installs and runs correctly
- [ ] Existing configs continue to work