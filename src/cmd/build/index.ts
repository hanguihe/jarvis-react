import webpack from 'webpack';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../webpack/config';

process.env.NODE_ENV = 'production';

const compiler = webpack(config());

const spinner = ora('正在执行构建...\n');
spinner.start();

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    spinner.stop();
    process.exit(1);
  }
  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  if (Array.isArray(info.assets)) {
    const table = getFileTable(info.assets);
    console.log(table, '\n\n');
  }

  let time = 0;
  if (typeof info.time === 'number') {
    time = Math.floor(info.time / 10) / 100;
  }

  spinner.succeed(`编译成功，耗时：${time}s.\n`);
});

function getFileTable(files: any[]) {
  const ui = require('cliui')({ width: 80 });
  const row = (a: string, b: string, c: string) => `${a}\t    ${b}\t    ${c}`;

  const head = row(
    chalk.cyan.bold('文件'),
    chalk.cyan.bold('体积'),
    chalk.cyan.bold('GZIP'),
  );

  const body = files
    .map((item) =>
      row(
        chalk.green(item.name),
        chalk.green(formatFileSize(item.size)),
        chalk.blue('未知'),
      ),
    )
    .join('\n');

  ui.div(`\n${head}\n\n${body}`);

  return ui.toString();
}

function formatFileSize(size: number) {
  const radix = 1024;
  const unit = ['B', 'KB', 'MB'];
  let loop = 0;

  while (size >= radix) {
    size /= radix;
    ++loop;
  }

  return `${size.toFixed(1)} ${unit[loop]}`;
}
