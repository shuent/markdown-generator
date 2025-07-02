# Sample Usage

This directory contains example configurations and templates for the markdown generator.

## Quick Start

1. Copy the configuration file you want to use:
   ```bash
   cp sample/mdg.config.js ./
   # or
   cp sample/example.mdg.config.ts ./mdg.config.ts
   ```

2. Copy the templates directory:
   ```bash
   cp -r sample/templates ./
   ```

3. Run the markdown generator:
   ```bash
   # Interactive mode
   mdg

   # Direct mode
   mdg --template blog "My Blog Post"
   mdg --template note "Meeting Notes"
   ```

## Files Included

### Configuration Files
- `mdg.config.js` - Basic configuration with blog and note templates
- `example.mdg.config.ts` - Advanced TypeScript configuration with multiple templates

### Templates
- `templates/default.md` - Default template
- `templates/blog.md` - Blog post template with frontmatter
- `templates/note.md` - Note template for quick notes
- `templates/daily.md` - Daily journal template with mood tracking

### Generated Examples
- `blog/` - Sample blog posts created by the generator
- `notes/` - Sample notes created by the generator

## Configuration Options

### Basic Config (JavaScript)
```javascript
export default {
  defaultTemplate: 'blog',
  globalVariables: {
    author: 'Your Name',
    siteUrl: 'https://example.com',
  },
  templates: {
    blog: {
      fileName: '{{date}}-{{slug}}',
      directory: 'blog',
      template: './templates/blog.md',
      // ... prompts and variables
    }
  }
};
```

### Advanced Config (TypeScript)
The `example.mdg.config.ts` shows advanced features like:
- Dynamic variables with functions
- Nested directory structures
- Multiple prompt types (input, list, checkbox)
- Environment-specific variables

## Template Variables

All templates support these built-in variables:
- `{{title}}` - The title of the content
- `{{date}}` - Current date (YYYY-MM-DD)
- `{{datetime}}` - Current date and time
- `{{slug}}` - URL-friendly version of the title
- `{{author}}` - Author name from config
- Plus any custom variables you define

## Tips

1. **Start Simple**: Use `mdg.config.js` for basic needs
2. **Customize Templates**: Modify the templates in `templates/` to match your style
3. **Add Variables**: Define custom variables in your config for reusable content
4. **Use Functions**: Create dynamic variables that compute values at generation time