import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  generateCommand,
  listTemplatesCommand,
  displayTemplates,
  createDefaultDependencies,
} from './commands/index.js';
import { initCommand, createDefaultInitDependencies } from './commands/init.js';
import { fold, safeCliAction } from './utils/functional.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('mdg')
  .description('Modern markdown generator with templates and interactive prompts')
  .version(packageJson.version)
  .option('-t, --template <name>', 'Template to use')
  .option('-v, --var <assignments...>', 'Variables in key=value format (e.g., --var slug=my-post title="My Title")')
  .action(
    safeCliAction(async (options) => {
      const deps = createDefaultDependencies();
      const generate = generateCommand(deps);
      
      // Parse variables from --var key=value format
      const variables: Record<string, string> = {};
      if (options.var) {
        for (const assignment of options.var) {
          const [key, ...valueParts] = assignment.split('=');
          if (key && valueParts.length > 0) {
            variables[key] = valueParts.join('=');
          }
        }
      }
      
      const result = await generate({
        template: options.template,
        variables,
      });

      return fold(
        result,
        (filePath) => {
          console.log(`✓ Created: ${filePath}`);
          return filePath;
        },
        (error) => {
          throw error;
        },
      );
    }),
  );

program
  .command('list')
  .description('List available templates')
  .action(
    safeCliAction(async () => {
      const deps = createDefaultDependencies();
      const listTemplates = listTemplatesCommand(deps);
      const configResult = await deps.configLoader();
      const templatesResult = await listTemplates();

      return fold(
        templatesResult,
        (templates) => {
          displayTemplates(templates, configResult.defaultTemplate);
          return templates;
        },
        (error) => {
          throw error;
        },
      );
    }),
  );

program
  .command('init')
  .description('Initialize a new project with config and sample templates')
  .action(
    safeCliAction(async () => {
      const deps = createDefaultInitDependencies();
      const init = initCommand(deps);
      const result = await init();

      return fold(
        result,
        (initResult) => {
          console.log(initResult.message);
          return initResult;
        },
        (error) => {
          throw error;
        },
      );
    }),
  );

program.parse();
