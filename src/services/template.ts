// Template service following SOLID principles

import { TemplateConfig, GeneratorOptions, BuiltInVariables } from '../types.js';
import { getDateVariables } from '../utils/date.js';
import { interpolate } from '../utils/string.js';
import { Result, asyncTryCatch } from '../utils/functional.js';

// Interfaces for dependency injection
export interface FileService {
  exists: (path: string) => Promise<boolean>;
  read: (path: string) => Promise<string>;
  write: (path: string, content: string) => Promise<void>;
  resolvePath: (...paths: string[]) => string;
}

export interface VariableResolver {
  resolve: (variables: Record<string, any>) => Record<string, any>;
}

export interface TemplateRenderer {
  render: (template: string, variables: Record<string, any>) => string;
}

// Default implementations
export const createDefaultVariableResolver = (): VariableResolver => ({
  resolve: (variables: Record<string, any>): Record<string, any> => {
    const resolved: Record<string, any> = {};
    for (const [key, value] of Object.entries(variables)) {
      resolved[key] = typeof value === 'function' ? value() : value;
    }
    return resolved;
  },
});

export const createDefaultTemplateRenderer = (): TemplateRenderer => ({
  render: (template: string, variables: Record<string, any>): string =>
    interpolate(template, variables),
});

// Pure functions for template processing
export const createBuiltInVariables = (slug?: string): BuiltInVariables => {
  const dateVars = getDateVariables();
  return {
    ...dateVars,
    ...(slug ? { slug } : {}),
  } as BuiltInVariables;
};

export const mergeVariables = (
  builtInVars: BuiltInVariables,
  globalVars: Record<string, any> = {},
  templateVars: Record<string, any> = {},
  optionVars: Record<string, any> = {},
  resolver: VariableResolver,
): Record<string, any> => ({
  ...builtInVars,
  ...resolver.resolve(globalVars),
  ...resolver.resolve(templateVars),
  ...resolver.resolve(optionVars),
});

export const getDefaultTemplate = (): string => `---
date: {{date}}
---

Write your content here...
`;

// Template processing pipeline
export const processTemplate =
  (
    template: TemplateConfig,
    options: GeneratorOptions,
    globalVariables: Record<string, any> = {},
    fileService: FileService,
    renderer: TemplateRenderer,
    resolver: VariableResolver,
  ) =>
  async (): Promise<Result<{ content: string; filePath: string }, Error>> => {
    const slug = options.slug || options.variables?.slug;
    const builtInVars = createBuiltInVariables(slug);

    // Merge all variables, including optional title
    const allVariables = {
      ...(options.title ? { title: options.title } : {}),
      ...options.variables,
    };

    const variables = mergeVariables(
      builtInVars,
      globalVariables,
      template.variables,
      allVariables,
      resolver,
    );

    // Get template content
    const templateContentResult = await asyncTryCatch(async () => {
      if (await fileService.exists(template.template)) {
        return await fileService.read(template.template);
      }
      return getDefaultTemplate();
    });

    if (!templateContentResult.success) return templateContentResult;

    // Render template
    const content = renderer.render(templateContentResult.data, variables);

    // Generate file path
    const fileName = renderer.render(template.fileName, variables);
    const directory = renderer.render(template.directory, variables);
    const filePath = fileService.resolvePath(directory, `${fileName}.md`);

    return {
      success: true,
      data: {
        content,
        filePath,
      },
    };
  };
