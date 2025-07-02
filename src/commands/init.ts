// Init command handler

import { existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { copyDirSync } from '../utils/file.js';
import { asyncTryCatch, Result } from '../utils/functional.js';

export interface InitDependencies {
  getCurrentDir: () => string;
  getPackageDir: () => string;
  fileExists: (path: string) => boolean;
  copyFile: (src: string, dest: string) => void;
  copyDirectory: (src: string, dest: string) => void;
}

export interface InitResult {
  configCopied: boolean;
  templatesCopied: boolean;
  message: string;
}

// Default dependencies
export const createDefaultInitDependencies = (): InitDependencies => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  
  return {
    getCurrentDir: () => process.cwd(),
    getPackageDir: () => join(__dirname, '..', '..'),
    fileExists: existsSync,
    copyFile: copyFileSync,
    copyDirectory: copyDirSync,
  };
};

// Pure functions for init logic
export const createInitPaths = (cwd: string, packageDir: string) => ({
  configSource: join(packageDir, 'sample', 'mdg.config.js'),
  configDest: join(cwd, 'mdg.config.js'),
  templatesSource: join(packageDir, 'sample', 'templates'),
  templatesDest: join(cwd, 'templates'),
});

export const shouldSkipFile = (dest: string, fileExists: (path: string) => boolean): boolean =>
  fileExists(dest);

export const copyFileIfNotExists = (
  src: string,
  dest: string,
  deps: InitDependencies
): { copied: boolean; message: string } => {
  if (shouldSkipFile(dest, deps.fileExists)) {
    return {
      copied: false,
      message: `⚠️  ${dest.split('/').pop()} already exists, skipping...`,
    };
  }

  deps.copyFile(src, dest);
  return {
    copied: true,
    message: `✓ Created ${dest.split('/').pop()}`,
  };
};

export const copyDirectoryIfNotExists = (
  src: string,
  dest: string,
  deps: InitDependencies
): { copied: boolean; message: string } => {
  if (shouldSkipFile(dest, deps.fileExists)) {
    return {
      copied: false,
      message: `⚠️  ${dest.split('/').pop()}/ directory already exists, skipping...`,
    };
  }

  deps.copyDirectory(src, dest);
  return {
    copied: true,
    message: `✓ Created ${dest.split('/').pop()}/ directory`,
  };
};

export const createSuccessMessage = (configCopied: boolean, templatesCopied: boolean): string => {
  if (!configCopied && !templatesCopied) {
    return 'Project already initialized!';
  }
  return '\n🎉 Project initialized successfully!\nYou can now run "mdg" to start generating markdown files.';
};

// Init command handler
export const initCommand = (deps: InitDependencies) =>
  async (): Promise<Result<InitResult, Error>> =>
    asyncTryCatch(async () => {
      const cwd = deps.getCurrentDir();
      const packageDir = deps.getPackageDir();
      const paths = createInitPaths(cwd, packageDir);

      const configResult = copyFileIfNotExists(
        paths.configSource,
        paths.configDest,
        deps
      );
      console.log(configResult.message);

      const templatesResult = copyDirectoryIfNotExists(
        paths.templatesSource,
        paths.templatesDest,
        deps
      );
      console.log(templatesResult.message);

      const message = createSuccessMessage(
        configResult.copied,
        templatesResult.copied
      );

      return {
        configCopied: configResult.copied,
        templatesCopied: templatesResult.copied,
        message,
      };
    });