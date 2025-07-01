import inquirer from 'inquirer';
import { MdgConfig, TemplateConfig, GeneratorOptions } from './types.js';
import { getTemplateNames } from './config.js';
import { parseList } from './utils/string.js';

export async function promptForTemplate(config: MdgConfig): Promise<string> {
  const templates = getTemplateNames(config);
  
  if (templates.length === 1) {
    return templates[0];
  }

  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select a template:',
      choices: templates,
      default: config.defaultTemplate,
    },
  ]);

  return template;
}

export async function promptForVariables(
  template: TemplateConfig,
): Promise<GeneratorOptions> {
  const prompts = template.prompts || {};
  const answers: Record<string, any> = {};

  for (const [key, promptConfig] of Object.entries(prompts)) {
    const answer = await inquirer.prompt([
      {
        type: promptConfig.type,
        name: key,
        message: promptConfig.message,
        default: promptConfig.default,
        choices: promptConfig.choices,
      },
    ]);

    answers[key] = answer[key];
  }

  // Process special fields
  const variables: Record<string, string> = {};
  let title = 'Untitled';

  for (const [key, value] of Object.entries(answers)) {
    if (key === 'title') {
      title = String(value);
    } else if (key === 'tags' && typeof value === 'string') {
      variables[key] = parseList(value).join(', ');
    } else if (Array.isArray(value)) {
      variables[key] = value.join(', ');
    } else {
      variables[key] = String(value);
    }
  }

  return {
    title,
    variables,
  };
}

export async function runInteractiveMode(config: MdgConfig): Promise<GeneratorOptions> {
  const templateName = await promptForTemplate(config);
  const template = config.templates[templateName];
  
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  const options = await promptForVariables(template);
  return {
    ...options,
    template: templateName,
  };
}