import ora from 'ora';
import fs from 'fs-extra';
import { logger, resolveProjectFile } from '../util/function';
import { BuildOptions } from '../type';
import { rollupTransform } from '../config/rollup';
import { gulpTransform } from '../config/gulp';

async function build(options: BuildOptions) {
  logger.cyan('start build component with babel and rollup ...');
  const spinner = ora();

  spinner.start('clean lib directory');
  fs.removeSync(resolveProjectFile('lib'));
  spinner.succeed();

  spinner.start('start build lib with babel');
  await gulpTransform({ ...options, buildType: 'cjs', outDir: 'lib' });
  spinner.succeed('build lib success');

  spinner.start('clean es directory');
  fs.removeSync(resolveProjectFile('es'));
  spinner.succeed();

  spinner.start('start build es with babel');
  await gulpTransform({ ...options, buildType: 'esm', outDir: 'es' });
  spinner.succeed('build es success');

  if (options.umd) {
    spinner.start('clean dist directory');
    fs.removeSync(resolveProjectFile('dist'));
    spinner.succeed();

    spinner.start('start build dist with rollup');
    await rollupTransform({ ...options, buildType: 'umd', outDir: 'dist' });
    spinner.succeed('build dist success');
  }

  logger.success('compile success');
}

export default build;
