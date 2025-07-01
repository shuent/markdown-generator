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
      title: 'Test Post',
      template: 'test',
    });

    expect(filePath).toMatch(/test-output.*test-post\.md$/);
    expect(await fileExists(filePath)).toBe(true);

    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toContain('title: "Test Post"');
    expect(content).toContain('author: Test Author');
    expect(content).toContain('# Test Post');
  });

  it('should create slug from title', async () => {
    const generator = new MarkdownGenerator(config);
    const filePath = await generator.generate({
      title: 'My Amazing Blog Post!',
      template: 'test',
    });

    expect(filePath).toContain('my-amazing-blog-post.md');
  });

  it('should handle custom variables', async () => {
    const generator = new MarkdownGenerator(config);
    const filePath = await generator.generate({
      title: 'Custom Test',
      template: 'test',
      variables: {
        tags: 'test, vitest',
        customField: 'custom value',
      },
    });

    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toContain('Test Author'); // Global variable
  });

  it('should list available templates', async () => {
    const generator = new MarkdownGenerator(config);
    const templates = await generator.listTemplates();
    
    expect(templates).toEqual(['test']);
  });
});