import { join } from 'path';
import { cyan, gray, yellow } from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import { BuildOptions, UserConfig } from '../type';

export const defaultBuildOptions: UserConfig = {
  mode: 'app',
  outDir: 'dist',
  port: 3000,
};

/**
 * 打印信息
 */
export const logger = {
  cyan: (text: string) => {
    console.log(cyan(text));
  },
  gray: (text: string) => {
    console.log(gray(text));
  },
  success: (text: string) => {
    return ora().succeed(text);
  },
  error: (text: string) => {
    return ora().fail(text);
  },
  warn: (text: string) => {
    console.log(yellow(text));
  },
};

export function resolveProjectFile(filepath: string) {
  return join(process.cwd(), filepath);
}

export function convertTime(time?: number): string {
  if (typeof time !== 'number') {
    return '0s';
  }

  const second = time / 1000;

  if (second <= 60) {
    return `${second}s`;
  }
  return `${Math.floor(second / 100)}m${(second % 60).toFixed(2)}s`;
}

export function readProjectPackage() {
  const pkg = fs.readFileSync(resolveProjectFile('package.json'), { encoding: 'utf-8' });

  return JSON.parse(pkg);
}

export function getUserConfig(): UserConfig {
  const path = resolveProjectFile('jarvis.config.js');
  const options = { ...defaultBuildOptions };

  try {
    return {
      ...options,
      ...require(path),
    };
  } catch {
    return options;
  }
}
