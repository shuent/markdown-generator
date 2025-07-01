import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig } from './config.js';
import { MarkdownGenerator } from './generator.js';
import { runInteractiveMode } from './prompts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

const program = new Command();

program
  .name('mdg')
  .description('Modern markdown generator with templates and interactive prompts')
  .version(packageJson.version)
  .argument('[title]', 'Title for the markdown file')
  .option('-t, --template <name>', 'Template to use')
  .action(async (title, options) => {
    try {
      const config = await loadConfig();
      const generator = new MarkdownGenerator(config);

      let generatorOptions;
      
      if (!title && !options.template) {
        // Interactive mode
        generatorOptions = await runInteractiveMode(config);
      } else {
        // Direct mode
        generatorOptions = {
          title: title || 'Untitled',
          template: options.template,
        };
      }

      const filePath = await generator.generate(generatorOptions);
      console.log(`✓ Created: ${filePath}`);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available templates')
  .action(async () => {
    try {
      const config = await loadConfig();
      const generator = new MarkdownGenerator(config);
      const templates = await generator.listTemplates();
      
      console.log('Available templates:');
      templates.forEach(template => {
        const isDefault = config.defaultTemplate === template;
        console.log(`  ${isDefault ? '❯' : ' '} ${template}${isDefault ? ' (default)' : ''}`);
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();