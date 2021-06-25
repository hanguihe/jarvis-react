import fs from 'fs-extra';
import { prompt } from 'inquirer';
import { join } from 'path';
import { execSync } from 'child_process';
import { sync as command } from 'command-exists';
import { logger, readProjectPackage } from '../util/function';
import { configurationInfo, scripts } from './resource';
import ora from 'ora';
var InitType;
(function (InitType) {
    InitType["config"] = "config";
})(InitType || (InitType = {}));
function init(type) {
    switch (type) {
        case InitType.config:
            return initConfig();
        default:
            logger.error('init params must be "config"');
            process.exit(0);
    }
}
module.exports = init;
async function initConfig() {
    logger.cyan('🔨  初始化项目工程规范配置\n');
    // 1. 复制项目配置文件
    const resourcePath = join(__dirname, '../../resource/project-configuration/');
    const projectPath = process.cwd() + '/';
    const resources = fs.readdirSync(resourcePath);
    const project = fs.readdirSync(projectPath);
    const deps = [];
    for (const file of resources) {
        if (project.includes(file)) {
            const { cover } = await prompt([
                {
                    type: 'confirm',
                    name: 'cover',
                    message: `当前项目存在 ${file} 文件，是否覆盖？`,
                    default: true,
                },
            ]);
            if (!cover) {
                continue;
            }
        }
        const item = configurationInfo.get(file);
        fs.copyFileSync(resourcePath + file, projectPath + file);
        deps.push(...(item?.needDepend || []));
        logger.success(`写入 ${item?.description}`);
    }
    logger.success('全部配置文件写入完成！\n');
    // 2. 安装必要依赖项
    const pkg = readProjectPackage();
    const allDeps = [...Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })];
    const set = [...new Set(deps.filter((item) => !allDeps.includes(item)))].join(' ');
    if (set.length > 0) {
        logger.cyan(`需要安装必要依赖项：${set}`);
        let cmd = '';
        if (command('yarn')) {
            cmd += 'yarn add -D ';
        }
        else if (command('npm')) {
            cmd += 'npm install -D ';
        }
        else {
            throw new Error('当前系统环境没有安装Yarn或Npm工具');
        }
        const spinner = ora(`开始安装项目依赖：${cmd + set} \n`);
        spinner.start();
        execSync(cmd + set);
        spinner.succeed('🚀  项目依赖安装成功！\n');
    }
    // 3. 增加script脚本
    const { script } = await prompt([
        {
            type: 'confirm',
            name: 'script',
            message: `是否需要增加script脚本？`,
            default: true,
        },
    ]);
    if (script) {
        const pkg = readProjectPackage();
        Object.assign(pkg.scripts, scripts);
        fs.writeFileSync(projectPath + 'package.json', JSON.stringify(pkg, null, 2));
        logger.success('写入scripts脚本成功！\n');
    }
    // 4. 增加commit hook
}
