import { extname } from 'path';
import vfs from 'vinyl-fs';
import though from 'through2';
import fs from 'fs-extra';
import ts from 'typescript';
import less from 'gulp-less';
import typescript from 'gulp-typescript';
import gulpIf from 'gulp-if';
import { resolveProjectFile } from '../util/function';
import { BuildOptions, BuildType } from '../type';
import { babelTransform, getBabelConfig } from './babel';

function transformLess() {
  return gulpIf((file) => extname(file.path) === '.less', less());
}

function transformType(buildType: BuildType) {
  const tsconfig = ts.readConfigFile(resolveProjectFile('tsconfig.json'), (path) =>
    fs.readFileSync(path, { encoding: 'utf-8' }),
  ).config;

  return gulpIf(
    (file) =>
      ['.tsx', '.ts'].includes(extname(file.path)) &&
      !file.path.endsWith('.d.ts') &&
      buildType === 'esm',
    typescript({
      ...tsconfig.compilerOptions,
      declaration: true,
    }),
  );
}

function transformJS(options: BuildOptions) {
  const babelConfig = getBabelConfig(options);

  return though.obj((file, env, callback) => {
    if (
      ['.tsx', '.ts', '.jsx', '.js'].includes(extname(file.path)) &&
      !file.path.endsWith('.d.ts')
    ) {
      const code = babelTransform(babelConfig, file);
      file.path = file.path.replace(extname(file.path), '.js');
      file.contents = Buffer.from(code);
    }

    callback(null, file);
  });
}

export async function gulpTransform(options: BuildOptions) {
  const { outDir = 'es', buildType = 'esm' } = options;

  vfs
    .src([resolveProjectFile('src/**/*')], {
      allowEmpty: true,
      base: resolveProjectFile('src'),
    })
    .pipe(transformLess())
    .pipe(transformType(buildType))
    .pipe(transformJS(options))
    .pipe(vfs.dest(outDir));

  return Promise.resolve();
}
