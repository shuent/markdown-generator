export type PromptType = 'input' | 'list' | 'checkbox';

export interface PromptConfig {
  type: PromptType;
  message: string;
  default?: any;
  choices?: string[];
}

export interface TemplateConfig {
  fileName: string;
  directory: string;
  template: string;
  variables?: Record<string, string | (() => string)>;
  prompts?: Record<string, PromptConfig>;
}

export interface MdgConfig {
  defaultTemplate?: string;
  globalVariables?: Record<string, string | (() => string)>;
  templates: Record<string, TemplateConfig>;
}

export interface GeneratorOptions {
  template?: string;
  title?: string;
  slug?: string;
  variables?: Record<string, string>;
}

