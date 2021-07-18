import { BuildOptions } from '../type';
import { extname } from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import vfs from 'vinyl-fs';
import gulpIf from 'gulp-if';
import typescript from 'gulp-typescript';
import less from 'gulp-less';
import ts from 'typescript';
import though from 'through2';
import { logger, resolveProjectFile } from '../util/function';
import babelTransform from '../config/babel';

function transform(type: 'cjs' | 'esm') {
  const tsconfig = ts.readConfigFile('tsconfig.json', (path) =>
    fs.readFileSync(path, { encoding: 'utf-8' }),
  ).config;

  vfs
    .src(['src/**/*'], {
      allowEmpty: true,
      base: resolveProjectFile('src'),
    })
    .pipe(gulpIf((file) => extname(file.path) === '.less', less()))
    .pipe(
      gulpIf(
        (file) => ['.tsx', '.ts'].includes(extname(file.path)) && !file.path.endsWith('.d.ts'),
        typescript({
          ...tsconfig.compilerOptions,
        }),
      ),
    )
    .pipe(
      though.obj((file, env, callback) => {
        if (
          ['.tsx', '.ts', '.jsx', '.js'].includes(extname(file.path)) &&
          !file.path.endsWith('.d.ts')
        ) {
          const code = babelTransform(type, file);
          file.path = file.path.replace(extname(file.path), '.js');
          file.contents = Buffer.from(code);
        }

        callback(null, file);
      }),
    )
    .pipe(vfs.dest(type === 'cjs' ? 'lib' : 'es'));
}

function buildComponent(options: BuildOptions) {
  const spinner = ora();

  spinner.start('clean lib directory');
  fs.removeSync(resolveProjectFile('lib'));
  spinner.succeed();

  spinner.start('start build cjs with babel');
  transform('cjs');
  spinner.succeed('build cjs success');

  spinner.start('start build esm with babel');
  transform('esm');
  spinner.succeed('build esm success');

  logger.success('compile success');
}

export default buildComponent;
