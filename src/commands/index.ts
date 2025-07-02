// Command handlers following SOLID principles

import { GeneratorOptions, MdgConfig } from '../types.js';
import { MarkdownGenerator } from '../generator.js';
import { runInteractiveMode } from '../prompts.js';
import { loadConfig } from '../config.js';
import { asyncTryCatch, Result } from '../utils/functional.js';

// Dependencies interface for dependency injection
export interface CommandDependencies {
  configLoader: () => Promise<MdgConfig>;
  generatorFactory: (config: MdgConfig) => MarkdownGenerator;
  interactiveMode: (config: MdgConfig) => Promise<GeneratorOptions>;
}

// Command result types
export type CommandResult = Result<string, Error>;

// Default dependencies implementation
export const createDefaultDependencies = (): CommandDependencies => ({
  configLoader: loadConfig,
  generatorFactory: (config: MdgConfig) => new MarkdownGenerator(config),
  interactiveMode: runInteractiveMode,
});

// Pure functions for command logic
export const createGeneratorOptions = (title?: string, template?: string): GeneratorOptions => ({
  title: title || 'Untitled',
  template,
});

export const shouldUseInteractiveMode = (title?: string, template?: string): boolean =>
  !title && !template;

// Generate command handler
export const generateCommand =
  (deps: CommandDependencies) =>
  async (title?: string, options?: { template?: string }): Promise<CommandResult> => {
    const configResult = await asyncTryCatch(deps.configLoader);
    if (!configResult.success) return configResult;

    const config = configResult.data;
    const generator = deps.generatorFactory(config);

    const optionsResult = await asyncTryCatch(async () => {
      if (shouldUseInteractiveMode(title, options?.template)) {
        return await deps.interactiveMode(config);
      }
      return createGeneratorOptions(title, options?.template);
    });

    if (!optionsResult.success) return optionsResult;

    const generateResult = await asyncTryCatch(() => generator.generate(optionsResult.data));

    return generateResult;
  };

// List templates command handler
export const listTemplatesCommand =
  (deps: CommandDependencies) => async (): Promise<Result<string[], Error>> => {
    const configResult = await asyncTryCatch(deps.configLoader);
    if (!configResult.success) return configResult;

    const config = configResult.data;
    const generator = deps.generatorFactory(config);

    return await asyncTryCatch(() => generator.listTemplates());
  };

// Format template list for display
export const formatTemplateList = (templates: string[], defaultTemplate?: string): string[] =>
  templates.map((template) => {
    const isDefault = defaultTemplate === template;
    return `  ${isDefault ? '❯' : ' '} ${template}${isDefault ? ' (default)' : ''}`;
  });

// Display templates
export const displayTemplates = (templates: string[], defaultTemplate?: string): void => {
  console.log('Available templates:');
  formatTemplateList(templates, defaultTemplate).forEach((line) => console.log(line));
};
