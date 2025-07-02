# markdown-generator

A modern, TypeScript-based CLI tool for generating markdown files with templates, interactive prompts, and variable interpolation. Perfect for blogs, documentation, and note-taking workflows.

## Why markdown-generator? The Pain We Solve

You have a brilliant idea for a blog post. You open your editor, ready to write. But first, you must perform the ritual:

1.  **Create the file:** You manually type out `2024-05-21-my-brilliant-idea.md` in the correct directory, hoping you didn't make a typo in the date.
2.  **Find a template:** You hunt for a previous post to copy-paste the frontmatter.
3.  **Clean up:** You painstakingly update the `title`, change the `date` to today, and clear out the old tags.

This isn't just a minor inconvenience; it's a **creative bottleneck**. This repetitive, manual setup drains your momentum before you've even written a single word. In a team, it leads to inconsistent file names and messy frontmatter.

**`markdown-generator` automates this entire tedious process.** It bridges the gap between idea and execution, letting you focus on what truly matters: your content.

### Use Cases: Where `mdg` Shines

- **For the Blogger & Content Creator:**
  - **Before:** "Ugh, I need to figure out the filename slug and copy the frontmatter from last week's post."
  - **After:** Run `mdg --var slug="my-article" title="My Article" tags="tech,tutorial"`, and start writing immediately. The file is created with all your metadata pre-filled. Your creative flow is never interrupted.

- **For the Documentation Team:**
  - **Before:** New team members create files with inconsistent naming conventions (`YYYY-MM-DD` vs `DD-MM-YYYY`) and forget required frontmatter fields.
  - **After:** The `mdg.config.ts` acts as an enforceable style guide. Everyone on the team uses `mdg` to generate consistent, error-free documentation files, every single time.

- **For the Diligent Note-Taker:**
  - **Before:** A fleeting idea strikes during a meeting. You scramble to create a new file, name it, and add context, but the idea's initial spark is lost in the process.
  - **After:** Simply type `mdg --template note --var slug="meeting-notes" title="Weekly Planning"`. A structured note file appears, ready for you to capture your thoughts without breaking stride.

Our goal is simple: to eliminate the boring, repetitive tasks and let you stay in your creative zone. Let `mdg` handle the housekeeping, so you can focus on writing.

## Features

- 🚀 **Interactive Mode**: No arguments needed - just run `mdg` and follow the prompts
- 📝 **Multiple Templates**: Define and use different templates for various content types
- 🔤 **Variable Interpolation**: Use variables like `{{title}}`, `{{author}}`, `{{date}}` in templates
- 🎯 **Smart Filename Generation**: Auto-generate filenames with date prefixes and your chosen slug
- 💡 **TypeScript**: Fully typed for better development experience
- ⚡ **Fast**: Built with modern tooling for optimal performance

## Quick Start

### 1. Setup mdg config

```bash
npx @shuent/markdown-generator init
```

This command will:

- Create a `mdg.config.js` configuration file
- Set up a `mdg_templates/` directory with sample templates

### 2. Start generating

```bash
npx @shuent/markdown-generator  # Interactive mode
```

> **Note**: If you prefer to install globally with `npm install -g @shuent/markdown-generator`, you can use the `mdg` command directly instead of `npx @shuent/markdown-generator`.

## Usage

### Interactive Mode (Recommended)

Simply run `mdg` without arguments:

```bash
$ mdg
? Select a template: (Use arrow keys)
❯ blog
  note
  documentation
? Slug: my-awesome-post
? Title: My Awesome Post
? Tags: typescript, cli
? Author: John Doe
✓ Created: blog/2024-01-15-my-awesome-post.md
```

### Direct Mode

Specify variables using the --var flag:

```bash
# Create a blog post with slug
mdg --var slug="my-blog-post"

# Create with specific template and slug
mdg --template blog --var slug="my-blog-post"
# or use the short form
mdg -t blog --var slug="my-blog-post"

# Create with multiple variables
mdg --var slug="my-blog-post" title="My Blog Post" author="John Doe" tags="typescript,cli"

# Any variable can be passed
mdg --var slug="my-post" category="tutorial" draft="true"

# List available templates
mdg list
```

### Quick Mode

For default template:

```bash
mdg --var slug="first-article"
# Creates: blog/2024-01-15-first-article.md (using default template)
# You can then edit the title in the generated markdown file
```

## Configuration

Create `mdg.config.js` or `mdg.config.ts` in your project root. See the `sample/` directory for examples:

```typescript
// mdg.config.ts
import { MdgConfig } from 'markdown-generator';

const config: MdgConfig = {
  // Default template (when no template specified)
  defaultTemplate: 'blog',

  // Global variables available to all templates
  globalVariables: {
    // Common date variables
    date: () => new Date().toISOString().split('T')[0],
    datetime: () => new Date().toISOString(),
    timestamp: () => Date.now().toString(),
    year: () => new Date().getFullYear().toString(),
    month: () => String(new Date().getMonth() + 1).padStart(2, '0'),
    day: () => String(new Date().getDate()).padStart(2, '0'),

    // Your custom variables
    author: 'John Doe',
    siteUrl: 'https://example.com',
  },

  // Template definitions
  templates: {
    blog: {
      fileName: '{{date}}-{{slug}}',
      directory: 'content/blog',
      template: './mdg_templates/blog.md',
      variables: {
        category: 'general',
      },
      prompts: {
        title: {
          type: 'input',
          message: 'Blog post title:',
        },
        slug: {
          type: 'input',
          message: 'Slug (URL-friendly name):',
        },
        tags: {
          type: 'input',
          message: 'Tags (comma-separated):',
        },
        category: {
          type: 'list',
          message: 'Category:',
          choices: ['general', 'tutorial', 'announcement'],
        },
      },
    },

    note: {
      fileName: '{{date}}-{{slug}}',
      directory: 'notes',
      template: './mdg_templates/note.md',
      prompts: {
        title: {
          type: 'input',
          message: 'Note title:',
        },
        type: {
          type: 'list',
          message: 'Note type:',
          choices: ['meeting', 'idea', 'todo'],
        },
      },
    },

    documentation: {
      fileName: '{{slug}}',
      directory: 'docs',
      template: './mdg_templates/doc.md',
      prompts: {
        title: {
          type: 'input',
          message: 'Documentation title:',
        },
        section: {
          type: 'input',
          message: 'Section:',
          default: 'guides',
        },
      },
    },
  },
};

export default config;
```

## Template Files

Create template files with frontmatter and variable placeholders:

```markdown
## <!-- mdg_templates/blog.md -->

title: "{{title}}"
date: {{date}}
tags: [{{tags}}]
author: {{author}}
category: {{category}}

---

# {{title}}

Write your content here...
```

## Variables

All variables must be defined in your configuration. There are no built-in variables - this gives you complete control over your templates.

### Common Variables

Here are some commonly used variables you can add to your config:

```typescript
globalVariables: {
  // Date-related variables
  date: () => new Date().toISOString().split('T')[0], // YYYY-MM-DD
  datetime: () => new Date().toISOString(),
  timestamp: () => Date.now().toString(),
  year: () => new Date().getFullYear().toString(),
  month: () => String(new Date().getMonth() + 1).padStart(2, '0'),
  day: () => String(new Date().getDate()).padStart(2, '0'),

  // Static values
  author: 'John Doe',
  siteUrl: 'https://example.com',
}
```

### Variable Types

- **Static values**: `author: 'John Doe'`
- **Dynamic values**: `date: () => new Date().toISOString().split('T')[0]`
- **From CLI**: `--var slug="my-post" title="My Title" customVar="value"`
- **From prompts**: Variables collected through interactive prompts

## Prompt Types

### Input Prompt

```typescript
title: {
  type: 'input',
  message: 'What is the title?',
  default: 'Untitled',
}
```

### List Prompt (Select One)

```typescript
category: {
  type: 'list',
  message: 'Select a category:',
  choices: ['tech', 'life', 'work'],
}
```

### Checkbox Prompt (Select Multiple)

```typescript
features: {
  type: 'checkbox',
  message: 'Select features:',
  choices: ['images', 'code', 'diagrams'],
}
```

## Advanced Usage

### Custom Date Formats

```typescript
templates: {
  daily: {
    fileName: '{{date:YYYY/MM/DD}}-daily',
    // Custom date format in filename
  }
}
```

### Conditional Variables

```typescript
variables: {
  isDraft: () => process.env.NODE_ENV !== 'production',
  environment: () => process.env.NODE_ENV || 'development',
}
```

### Nested Directories

```typescript
templates: {
  projectDocs: {
    directory: 'projects/{{project}}/docs',
    prompts: {
      project: {
        type: 'input',
        message: 'Project name:',
      },
    },
  },
}
```

## CLI Commands

```bash
# Initialize configuration and templates
mdg init

# Show help
mdg --help

# Show version
mdg --version

# List available templates
mdg list

# Interactive mode (default when no options provided)
mdg

# Create with specific template
mdg --template <template-name>
# or use the short form
mdg -t <template-name>

# Create with template and variables
mdg --template <template-name> --var key=value key2="value with spaces"
# or use the short form
mdg -t <template-name> --var key=value

# Pass multiple variables (space-separated)
mdg --var slug=my-post title="My Post Title" author="John Doe"

# Variables support:
# - Simple values: --var slug=my-post
# - Quoted values with spaces: --var title="My Post Title"
# - Multiple assignments: --var key1=value1 key2=value2 key3=value3
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/markdown-generator

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

## License

MIT
