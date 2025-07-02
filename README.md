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
  - **After:** Run `mdg "my-article"`, and start writing immediately. The file is created with the slug you want, and you can edit the title and other metadata directly in the generated markdown file. Your creative flow is never interrupted.

- **For the Documentation Team:**
  - **Before:** New team members create files with inconsistent naming conventions (`YYYY-MM-DD` vs `DD-MM-YYYY`) and forget required frontmatter fields.
  - **After:** The `mdg.config.ts` acts as an enforceable style guide. Everyone on the team uses `mdg` to generate consistent, error-free documentation files, every single time.

- **For the Diligent Note-Taker:**
  - **Before:** A fleeting idea strikes during a meeting. You scramble to create a new file, name it, and add context, but the idea's initial spark is lost in the process.
  - **After:** Simply type `mdg --template note "meeting-notes"`. A structured note file appears, ready for you to capture your thoughts without breaking stride.

Our goal is simple: to eliminate the boring, repetitive tasks and let you stay in your creative zone. Let `mdg` handle the housekeeping, so you can focus on writing.

## Features

- 🚀 **Interactive Mode**: No arguments needed - just run `mdg` and follow the prompts
- 📝 **Multiple Templates**: Define and use different templates for various content types
- 🔤 **Variable Interpolation**: Use variables like `{{title}}`, `{{author}}`, `{{date}}` in templates
- 🎯 **Smart Filename Generation**: Auto-generate filenames with date prefixes and your chosen slug
- 💡 **TypeScript**: Fully typed for better development experience
- ⚡ **Fast**: Built with modern tooling for optimal performance

## Installation

```bash
npm install -g @shuent/markdown-generator
# or
npm install --save-dev @shuent/markdown-generator
```

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

Specify slug directly:

```bash
# Create a blog post with slug
mdg "my-blog-post"

# Create with specific template
mdg --template blog "my-blog-post"

# Create with title and other variables
mdg "my-blog-post" --title "My Blog Post" --var author="John Doe"

# List available templates
mdg list
```

### Quick Mode

For default template:

```bash
mdg "first-article"
# Creates: blog/2024-01-15-first-article.md (using default template)
# You can then edit the title in the generated markdown file
```

## Quick Start

1. **Initialize your project**:

   ```bash
   mdg init
   ```

   This command will:
   - Create a `mdg.config.js` configuration file
   - Set up a `mdg_templates/` directory with sample templates
   - Guide you through initial configuration

2. **Start generating**:

   ```bash
   mdg  # Interactive mode
   ```

3. **Customize your setup**:
   - Edit `mdg.config.js` to add/modify templates
   - Customize template files in the `mdg_templates/` directory
   - Add your own variables and prompts

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
    author: 'John Doe',
    siteUrl: 'https://example.com',
    currentYear: () => new Date().getFullYear().toString(),
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

## Available Variables

### Built-in Variables

- `{{date}}` - Current date (format: YYYY-MM-DD)
- `{{datetime}}` - Current date and time
- `{{timestamp}}` - Unix timestamp
- `{{year}}` - Current year
- `{{month}}` - Current month
- `{{day}}` - Current day
- `{{slug}}` - Slug (from CLI argument or prompt)

### Custom Variables

Define custom variables in your config:

- Static values: `author: 'John Doe'`
- Dynamic values: `currentTime: () => new Date().toLocaleTimeString()`

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

# Create with specific template
mdg --template [template-name] "[slug]"

# Create with title
mdg "[slug]" --title "[title]"

# Interactive mode
mdg
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
