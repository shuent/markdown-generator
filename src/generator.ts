import { BuiltInVariables, GeneratorOptions, MdgConfig, TemplateConfig } from './types.js';
import { getDateVariables } from './utils/date.js';
import { createSlug, interpolate } from './utils/string.js';
import { readFile, writeFile, resolvePath, fileExists } from './utils/file.js';
import { getTemplate } from './config.js';

export class MarkdownGenerator {
  constructor(private config: MdgConfig) {}

  async generate(options: GeneratorOptions): Promise<string> {
    const template = getTemplate(this.config, options.template);
    const variables = await this.collectVariables(template, options);
    const content = await this.renderTemplate(template, variables);
    const filePath = await this.getFilePath(template, variables);
    
    await writeFile(filePath, content);
    return filePath;
  }

  private async collectVariables(
    template: TemplateConfig,
    options: GeneratorOptions,
  ): Promise<Record<string, any>> {
    const dateVars = getDateVariables();
    const title = options.title || 'Untitled';
    const slug = createSlug(title);
    
    const builtInVars: BuiltInVariables = {
      ...dateVars,
      title,
      slug,
    } as BuiltInVariables;

    // Resolve all variables, executing functions if needed
    const resolveVariables = (vars: Record<string, any>): Record<string, any> => {
      const resolved: Record<string, any> = {};
      for (const [key, value] of Object.entries(vars)) {
        resolved[key] = typeof value === 'function' ? value() : value;
      }
      return resolved;
    };

    const variables: Record<string, any> = {
      ...builtInVars,
      ...resolveVariables(this.config.globalVariables || {}),
      ...resolveVariables(template.variables || {}),
      ...resolveVariables(options.variables || {}),
    };

    return variables;
  }

  private async renderTemplate(
    template: TemplateConfig,
    variables: Record<string, any>,
  ): Promise<string> {
    let templateContent: string;
    
    if (await fileExists(template.template)) {
      templateContent = await readFile(template.template);
    } else {
      templateContent = this.getDefaultTemplate();
    }

    // First interpolate the entire template string
    const interpolatedTemplate = interpolate(templateContent, variables);
    
    // Return the interpolated template as is (it already includes frontmatter and content)
    return interpolatedTemplate;
  }

  private async getFilePath(
    template: TemplateConfig,
    variables: Record<string, any>,
  ): Promise<string> {
    const fileName = interpolate(template.fileName, variables);
    const directory = interpolate(template.directory, variables);
    
    return resolvePath(directory, `${fileName}.md`);
  }

  private getDefaultTemplate(): string {
    return `---
title: "{{title}}"
date: {{date}}
author: {{author}}
---

# {{title}}

Write your content here...
`;
  }

  async listTemplates(): Promise<string[]> {
    return Object.keys(this.config.templates);
  }
}