import fs from 'fs-extra';
import ora from 'ora';
import webpack from 'webpack';
import { convertTime, getUserConfig, resolveProjectFile } from './util/function';
import { getWebpackConfig } from './config/webpack';
import { BuildOptions } from './type';

process.env.NODE_ENV = 'production';

function buildComponent(options: BuildOptions) {}

function buildApp(options: BuildOptions) {
  const spinner = ora();

  const publicDirPath = resolveProjectFile('public');
  const outDirPath = resolveProjectFile('dist');

  spinner.start('clean dist directory');
  fs.removeSync(outDirPath);
  spinner.succeed();

  spinner.start('copy public files');
  fs.copySync(publicDirPath, outDirPath, {
    dereference: true,
    filter: (file: string) => !file.includes('index.html'),
  });
  spinner.succeed();

  spinner.start('start to compile with webpack ...');
  const config = getWebpackConfig(options);
  const compiler = webpack(config);

  console.log(require.resolve('react/jsx-runtime'));

  compiler.run((err, stats) => {
    if (err) {
      spinner.fail('compile with errors');
      throw err;
    }

    const info = stats?.toJson() || {};

    if (Array.isArray(info.errors)) {
      spinner.fail('compile with errors');
      info.errors.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
      process.exit(1);
    }

    if (Array.isArray(info.warnings)) {
      spinner.info('compile with warnings');
      info.warnings.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
    }

    spinner.succeed(`compile success in ${convertTime(info.time)}`);
  });
}

function build() {
  const cwd = process.cwd();

  const userConfig = getUserConfig();

  if (userConfig.mode === 'component') {
    return buildComponent({ ...userConfig, cwd });
  } else {
    return buildApp({ ...userConfig, cwd });
  }
}

module.exports = build;
