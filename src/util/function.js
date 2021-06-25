import { join } from 'path';
import { cyan, gray } from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
/**
 * 打印信息
 */
export const logger = {
    cyan: (text) => {
        console.log(cyan(text));
    },
    gray: (text) => {
        console.log(gray(text));
    },
    success: (text) => {
        return ora().succeed(text);
    },
    error: (text) => {
        return ora().fail(text);
    },
};
export function resolveProjectFile(filepath) {
    return join(process.cwd(), filepath);
}
export function convertTime(time) {
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
