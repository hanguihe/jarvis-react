import { resolve } from 'path';
import { prompt } from 'inquirer';
import { cyan, gray } from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync } from 'fs';

/**
 * @description 终端交互 - 询问
 * @param message
 * @return Promise<Boolean>
 */
export async function confirm(message: string) {
  const { answer } = await prompt([
    {
      type: 'confirm',
      name: 'answer',
      message,
      default: true,
    },
  ]);
  return answer;
}

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
};

/**
 * 读取项目package.json文件
 */
export function getPackageInfo() {
  return JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf-8'));
}

export function writePackageInfo(info: any) {
  writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(info));
}

export function getLocalModulesPath(name: string) {
  return resolve(__dirname, `../../node_modules/${name}`);
}
