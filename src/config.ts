import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';
import { MdgConfig } from './types.js';
import { resolvePath } from './utils/file.js';

const PromptConfigSchema = z.object({
  type: z.enum(['input', 'list', 'checkbox']),
  message: z.string(),
  default: z.any().optional(),
  choices: z.array(z.string()).optional(),
});

const TemplateConfigSchema = z.object({
  fileName: z.string(),
  directory: z.string(),
  template: z.string(),
  variables: z.record(z.union([z.string(), z.function().returns(z.string())])).optional(),
  prompts: z.record(PromptConfigSchema).optional(),
});

const MdgConfigSchema = z.object({
  defaultTemplate: z.string().optional(),
  globalVariables: z.record(z.union([z.string(), z.function().returns(z.string())])).optional(),
  templates: z.record(TemplateConfigSchema),
});

const DEFAULT_CONFIG: MdgConfig = {
  defaultTemplate: 'default',
  globalVariables: {
    author: process.env.USER || 'Author',
  },
  templates: {
    default: {
      fileName: '{{date}}-{{slug}}',
      directory: 'content',
      template: resolvePath('templates', 'default.md'),
      prompts: {
        title: {
          type: 'input',
          message: 'Title:',
        },
      },
    },
  },
};

export async function loadConfig(): Promise<MdgConfig> {
  const explorer = cosmiconfig('mdg', {
    searchPlaces: [
      'mdg.config.js',
      'mdg.config.ts',
      'mdg.config.json',
      '.mdgrc',
      '.mdgrc.json',
      '.mdgrc.js',
      'package.json',
    ],
  });

  try {
    const result = await explorer.search();
    
    if (!result || !result.config) {
      return DEFAULT_CONFIG;
    }

    const validated = MdgConfigSchema.parse(result.config);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid configuration: ${error.message}`);
    }
    throw error;
  }
}

export function getTemplateNames(config: MdgConfig): string[] {
  return Object.keys(config.templates);
}

export function getTemplate(config: MdgConfig, templateName?: string) {
  const name = templateName || config.defaultTemplate || 'default';
  const template = config.templates[name];
  
  if (!template) {
    throw new Error(`Template '${name}' not found`);
  }
  
  return template;
}