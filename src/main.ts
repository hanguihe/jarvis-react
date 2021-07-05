import parser from 'yargs-parser';
import { logger } from './util/function';
import fs from 'fs-extra';

const args = parser(process.argv.splice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
  },
  boolean: ['version'],
});

/**
 * 共6个命令
 * 1. help：列出帮助选项
 * 2. version：jarvis版本信息
 * 3. new：新建一个react项目
 * 4. dev：执行本地项目开发构建
 * 5. build：执行生产环境构建
 * 6. project-configuration：完善当前项目规范，包括：eslint prettier stylelint等
 */

if (args.version && !args._[0]) {
  args._[0] = 'version';
  const info = require('../package.json');
  logger.cyan(`jarvis @${info.version}`);
} else if (!args._[0]) {
  args._[0] = 'help';
}

try {
  switch (args._[0]) {
    case 'new':
      logger.cyan('执行新建项目命令');
      break;
    case 'init':
      require('./init')(args._[1]);
      break;
    case 'dev':
      require('./dev')();
      break;
    case 'build':
      require('./build')();
      break;
    case 'project-configuration':
      require('./cmd/project-configuration/index');
      break;
    default:
      break;
  }
} catch (err) {
  fs.writeFileSync('./log.txt', err.toString());
  throw err;
}
