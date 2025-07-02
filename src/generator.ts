import { GeneratorOptions, MdgConfig } from './types.js';
import { readFile, writeFile, resolvePath, fileExists } from './utils/file.js';
import { getTemplate } from './config.js';
import {
  FileService,
  VariableResolver,
  TemplateRenderer,
  processTemplate,
  createDefaultVariableResolver,
  createDefaultTemplateRenderer,
} from './services/template.js';
import { fold } from './utils/functional.js';

export class MarkdownGenerator {
  constructor(
    private config: MdgConfig,
    private fileService: FileService = createDefaultFileService(),
    private variableResolver: VariableResolver = createDefaultVariableResolver(),
    private templateRenderer: TemplateRenderer = createDefaultTemplateRenderer(),
  ) {}

  async generate(options: GeneratorOptions): Promise<string> {
    const template = getTemplate(this.config, options.template);

    const process = processTemplate(
      template,
      options,
      this.config.globalVariables,
      this.fileService,
      this.templateRenderer,
      this.variableResolver,
    );

    const result = await process();

    return fold(
      result,
      async ({ content, filePath }) => {
        await this.fileService.write(filePath, content);
        return filePath;
      },
      (error) => {
        throw error;
      },
    );
  }

  async listTemplates(): Promise<string[]> {
    return Object.keys(this.config.templates);
  }
}

// Default file service implementation
const createDefaultFileService = (): FileService => ({
  exists: fileExists,
  read: readFile,
  write: writeFile,
  resolvePath,
});
