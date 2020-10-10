import { readdirSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import { sync as command } from 'command-exists';
import {
  confirm,
  getPackageInfo,
  logger,
  writePackageInfo,
} from '../../util/function';
import config from './config.json';

async function main() {
  logger.cyan('🔨 初始化项目工程化规范\n');

  // 写入配置文件
  const deps = await writeConfigFile();

  // 安装必须依赖项
  await installProjectDeps(deps);

  // 询问是否增加script脚本
  await insertPackageInfo();
}

main()
  .then(() => {
    logger.cyan('🚀 DONE');
    process.exit(0);
  })
  .catch((err) => {
    throw new Error(err);
  });

// 写入配置文件
async function writeConfigFile() {
  const cwd = process.cwd();
  const projectFileList = readdirSync(cwd);

  const dependList = [];

  for (const item of config.files) {
    const path = resolve(__dirname, item.path);
    const name = `${cwd}/${item.name}`;

    // 判断当前项目下是否存在该配置文件
    if (!projectFileList.includes(item.name)) {
      // 不存在 --> 直接复制
      copyFileSync(path, name);
    } else {
      // 存在  -->  询问是否覆盖
      const res = await confirm(`当前项目存在${item.name}文件，是否覆盖？`);
      if (res) {
        copyFileSync(path, name);
      }
    }

    dependList.push(...item.needDepend);
    logger.success(`写入${item.description} \n`);
  }

  logger.success('全部配置文件写入完成！\n');

  return [...new Set(dependList)];
}

// 安装依赖项
async function installProjectDeps(deps: string[]) {
  const info = getPackageInfo();
  const { dependencies = [], devDependencies = [] } = info;
  const projectDeps = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
  ];

  const names = deps
    .map((item) => {
      if (!projectDeps.includes(item)) {
        return item;
      }
      return false;
    })
    .filter(Boolean)
    .join(' ');

  if (!names) {
    return;
  }

  let cmd = '';

  if (command('yarn')) {
    cmd = 'yarn add -D ';
  } else if (command('npm')) {
    cmd = 'npm install -D ';
  } else {
    throw new Error('当前系统环境没有安装npm命令或yarn命令');
  }

  const spinner = ora('正在安装项目依赖...\n');
  spinner.start();

  const shell = promisify(exec);
  await shell(`${cmd}${names}`);

  spinner.stop();
  logger.cyan('🚀 项目依赖安装成功！');
}

// 增加script脚本
async function insertPackageInfo() {
  const answer = await confirm('是否需要增加script脚本？');
  if (!answer) {
    return;
  }

  const { scripts } = config;
  const info = getPackageInfo();

  if (!info.scripts) {
    info.scripts = {};
  }
  const keys = Object.keys(info.scripts);

  Object.keys(scripts).forEach((key) => {
    if (!keys.includes(key)) {
      info.scripts[key] = scripts[key];
    }
  });
  // 写入package.json
  writePackageInfo(info);

  logger.success('写入script脚本成功！\n');
}
