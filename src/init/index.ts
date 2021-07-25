import fs from 'fs-extra';
import { prompt } from 'inquirer';
import { join } from 'path';
import { execSync } from 'child_process';
import { sync as command } from 'command-exists';
import { logger, readProjectPackage } from '../util/function';
import { commitHook, configurationInfo, scripts } from './resource';
import ora from 'ora';

enum InitType {
  config = 'config',
  app = 'app',
  component = 'component',
}

function init(type: InitType, rest: string[]) {
  switch (type) {
    case InitType.config:
      return initConfig();
    case InitType.app:
      return initApp(rest);
    default:
      logger.error('init params must be "config" | "app" | "component"');
      process.exit(0);
  }
}

module.exports = init;

async function initConfig() {
  logger.cyan('🔨  初始化项目工程规范配置\n');
  const pkg = readProjectPackage();

  // 1. 复制项目配置文件
  const resourcePath = join(__dirname, '../../resource/config/');
  const projectPath = process.cwd() + '/';

  const resources = fs.readdirSync(resourcePath);
  const project = fs.readdirSync(projectPath);

  const deps: string[] = [];

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

  // 2. 增加script脚本
  const { script } = await prompt([
    {
      type: 'confirm',
      name: 'script',
      message: `是否需要增加script脚本？`,
      default: true,
    },
  ]);
  if (script) {
    Object.assign(pkg.scripts, scripts);

    fs.writeFileSync(projectPath + 'package.json', JSON.stringify(pkg, null, 2));
    logger.success('写入scripts脚本成功！\n');
  }

  // 3. 增加commit hook
  const { commit } = await prompt([
    {
      type: 'confirm',
      name: 'commit',
      message: `是否需要增加git commit脚本？`,
      default: true,
    },
  ]);
  if (commit) {
    Object.assign(pkg, commitHook);
    fs.writeFileSync(projectPath + 'package.json', JSON.stringify(pkg, null, 2));
    logger.success('写入git hook成功！\n');
    deps.push('lint-staged');
  }

  // 4. 安装必要依赖项
  const allDeps = [...Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })];
  const set = [...new Set(deps.filter((item) => !allDeps.includes(item)))].join(' ');

  if (set.length > 0) {
    logger.cyan(`需要安装必要依赖项：${set} \n`);

    let cmd = '';
    if (command('yarn')) {
      cmd += 'yarn add -D ';
    } else if (command('npm')) {
      cmd += 'npm install -D ';
    } else {
      throw new Error('当前系统环境没有安装Yarn或Npm工具');
    }
    const spinner = ora(`开始安装项目依赖：${cmd + set} \n`);
    spinner.start();
    execSync(cmd + set);

    spinner.succeed('🚀  项目依赖安装成功！\n');
  }
}

async function initApp(params: string[]) {
  logger.cyan('🔨  初始化项目工程目录\n');

  const dirName = params.length > 0 ? `/${params[0]}/` : '/';

  const resourcePath = join(__dirname, '../../resource/template/app');
  const projectPath = process.cwd() + dirName;

  fs.copySync(resourcePath, projectPath);

  logger.success('初始化项目工程目录成功！');
}
