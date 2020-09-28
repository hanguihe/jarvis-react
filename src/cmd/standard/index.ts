import { readdirSync, copyFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import { sync as command } from 'command-exists';
import { confirm, logger } from '../../util/function';
import config from './config.json';

async function main() {
  logger.cyan('🔨 初始化项目工程化规范\n');

  // 写入配置文件
  const deps = await write();

  // 获取package.json并判断是否需要增加依赖项
  const info = getPackageInfo();
  const projectDeps = [...Object.keys(info.dependencies), ...Object.keys(info.devDependencies)];

  const needInstall = deps
    .map((item) => {
      if (!projectDeps.includes(item)) {
        return item;
      }
      return false;
    })
    .filter(Boolean);

  if (needInstall.length > 0) {
    await installDeps(needInstall.join(' '));
  }

  // 询问是否增加script脚本
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// 写入配置文件
async function write() {
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

// 读取项目依赖项
function getPackageInfo() {
  return JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf-8'));
}

// 安装依赖项
async function installDeps(names: string) {
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
