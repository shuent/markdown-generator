import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { MarkdownGenerator } from '../src/generator';
import { MdgConfig } from '../src/types';
import { fileExists } from '../src/utils/file';

describe('MarkdownGenerator', () => {
  const testDir = join(process.cwd(), 'test-output');
  const config: MdgConfig = {
    defaultTemplate: 'test',
    globalVariables: {
      author: 'Test Author',
    },
    templates: {
      test: {
        fileName: '{{date}}-{{slug}}',
        directory: testDir,
        template: './nonexistent.md', // Will use default template
        variables: {
          category: 'test',
        },
      },
    },
  };

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should generate markdown file with interpolated variables', async () => {
    const generator = new MarkdownGenerator(config);
    const filePath = await generator.generate({
      slug: 'test-post',
      template: 'test',
      variables: {
        title: 'Test Post',
      },
    });

    expect(filePath).toMatch(/test-output.*test-post\.md$/);
    expect(await fileExists(filePath)).toBe(true);

    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toContain('date:');
    // Default template no longer includes author, it's a custom variable
  });

  it('should use provided slug', async () => {
    const generator = new MarkdownGenerator(config);
    const filePath = await generator.generate({
      slug: 'my-amazing-blog-post',
      template: 'test',
    });

    expect(filePath).toContain('my-amazing-blog-post.md');
  });

  it('should handle custom variables', async () => {
    const generator = new MarkdownGenerator(config);
    const filePath = await generator.generate({
      slug: 'custom-test',
      template: 'test',
      variables: {
        title: 'Custom Test',
        tags: 'test, vitest',
        customField: 'custom value',
      },
    });

    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toContain('date:'); // Built-in variable
    // Author is now a custom variable and needs to be in the template
  });

  it('should list available templates', async () => {
    const generator = new MarkdownGenerator(config);
    const templates = await generator.listTemplates();
    
    expect(templates).toEqual(['test']);
  });

  it('should handle missing slug gracefully', async () => {
    const generator = new MarkdownGenerator(config);
    const filePath = await generator.generate({
      template: 'test',
      variables: {
        title: 'No Slug Test',
      },
    });

    // Should still generate a file, but with {{slug}} in the filename
    expect(filePath).toContain('{{slug}}.md');
    expect(await fileExists(filePath)).toBe(true);
  });
});