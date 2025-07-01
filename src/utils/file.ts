import { promises as fs, existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import { dirname, resolve, join } from 'path';

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error}`);
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`);
  }
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    const dir = dirname(filePath);
    await ensureDir(dir);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error}`);
  }
}

export function resolvePath(...paths: string[]): string {
  return resolve(process.cwd(), ...paths);
}

export function copyDirSync(src: string, dest: string): void {
  try {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    
    const files = readdirSync(src);
    
    for (const file of files) {
      const srcPath = join(src, file);
      const destPath = join(dest, file);
      
      if (statSync(srcPath).isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy directory ${src} to ${dest}: ${error}`);
  }
}