import inquirer from 'inquirer';
import { MdgConfig, TemplateConfig, GeneratorOptions, PromptConfig } from './types.js';
import { getTemplateNames } from './config.js';
import { parseList } from './utils/string.js';
import { asyncTryCatch, Result, map } from './utils/functional.js';

// Functional prompt utilities
export const shouldPromptForTemplate = (templates: string[]): boolean => templates.length > 1;

export const createTemplatePrompt = (templates: string[], defaultTemplate?: string) => ({
  type: 'list' as const,
  name: 'template',
  message: 'Select a template:',
  choices: templates,
  default: defaultTemplate,
});

export const promptForTemplate =
  (config: MdgConfig) => async (): Promise<Result<string, Error>> => {
    const templates = getTemplateNames(config);

    if (!shouldPromptForTemplate(templates)) {
      return { success: true, data: templates[0] };
    }

    return asyncTryCatch(async () => {
      const prompt = createTemplatePrompt(templates, config.defaultTemplate);
      const { template } = await inquirer.prompt([prompt]);
      return template;
    });
  };

// Pure functions for prompt processing
export const createInquirerPrompt = (key: string, config: PromptConfig) => ({
  type: config.type,
  name: key,
  message: config.message,
  default: config.default,
  choices: config.choices,
});

export const processAnswerValue = (
  key: string,
  value: any,
): { key: string; processedValue: string } => {
  if (key === 'tags' && typeof value === 'string') {
    return { key, processedValue: parseList(value).join(', ') };
  }
  if (Array.isArray(value)) {
    return { key, processedValue: value.join(', ') };
  }
  return { key, processedValue: String(value) };
};

export const extractTitleAndVariables = (answers: Record<string, any>): GeneratorOptions => {
  const variables: Record<string, string> = {};
  let title = 'Untitled';

  Object.entries(answers).forEach(([key, value]) => {
    if (key === 'title') {
      title = String(value);
    } else {
      const { processedValue } = processAnswerValue(key, value);
      variables[key] = processedValue;
    }
  });

  return { title, variables };
};

export const collectAnswers =
  (prompts: Record<string, PromptConfig>) =>
  async (): Promise<Result<Record<string, any>, Error>> => {
    return asyncTryCatch(async () => {
      const answers: Record<string, any> = {};

      for (const [key, promptConfig] of Object.entries(prompts)) {
        const prompt = createInquirerPrompt(key, promptConfig);
        const answer = await inquirer.prompt([prompt]);
        answers[key] = answer[key];
      }

      return answers;
    });
  };

export const promptForVariables =
  (template: TemplateConfig) => async (): Promise<Result<GeneratorOptions, Error>> => {
    const prompts = template.prompts || {};
    const answersResult = await collectAnswers(prompts)();

    return map(answersResult, extractTitleAndVariables);
  };

export const getTemplateByName = (
  config: MdgConfig,
  templateName: string,
): Result<TemplateConfig, Error> => {
  const template = config.templates[templateName];

  if (!template) {
    return { success: false, error: new Error(`Template '${templateName}' not found`) };
  }

  return { success: true, data: template };
};

const runInteractiveModeFunc =
  (config: MdgConfig) => async (): Promise<Result<GeneratorOptions, Error>> => {
    const templateNameResult = await promptForTemplate(config)();

    if (!templateNameResult.success) return templateNameResult;

    const templateName = templateNameResult.data;
    const templateResult = getTemplateByName(config, templateName);

    if (!templateResult.success) return templateResult;

    const template = templateResult.data;
    const optionsResult = await promptForVariables(template)();

    if (!optionsResult.success) return optionsResult;

    return {
      success: true,
      data: {
        ...optionsResult.data,
        template: templateName,
      },
    };
  };

// Legacy wrapper for backward compatibility
export async function runInteractiveMode(config: MdgConfig): Promise<GeneratorOptions> {
  const result = await runInteractiveModeFunc(config)();

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
