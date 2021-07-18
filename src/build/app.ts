import ora from 'ora';
import fs from 'fs-extra';
import webpack from 'webpack';
import { getWebpackConfig } from '../config/webpack';
import { convertTime, resolveProjectFile } from '../util/function';
import { BuildOptions } from '../type';

function app(options: BuildOptions) {
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

  compiler.run((err, stats) => {
    if (err) {
      spinner.fail('compile with errors');
      throw err;
    }

    const info = stats?.toJson() || {};

    if (Array.isArray(info.errors) && info.errors.length > 0) {
      spinner.fail('compile with errors');
      info.errors.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
      process.exit(1);
    }

    if (Array.isArray(info.warnings) && info.warnings.length > 0) {
      spinner.info('compile with warnings');
      info.warnings.forEach((item) => {
        console.error(item.moduleName);
        console.error(item.message);
      });
    }

    spinner.succeed(`compile success in ${convertTime(info.time)}`);
  });
}

export default app;
