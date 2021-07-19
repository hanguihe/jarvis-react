import { OutputOptions, rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { getBabelConfig } from './babel';
import { readProjectPackage, resolveProjectFile } from '../util/function';
import { BuildOptions } from '../type';

const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
};
const defaultExternal = ['react', 'react-dom', 'react/jsx-runtime'];

export function getRollupConfig(options: BuildOptions) {
  const pkg = readProjectPackage();

  const {
    globals = defaultGlobals,
    name = pkg.name,
    external = defaultExternal,
    outDir = 'dist',
  } = options;

  const babelConfig = getBabelConfig(options) as RollupBabelInputPluginOptions;

  return {
    input: resolveProjectFile('src'),
    output: {
      file: `${outDir}/index.js`,
      format: 'umd',
      name,
      globals,
    },
    context: 'window',
    external: [...external],
    plugins: [
      postcss({
        // @ts-ignore
        use: {
          less: {
            javascriptEnabled: true,
          },
        },
      }),
      nodeResolve({
        mainFields: ['module', 'jsxnext:main', 'main'],
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      }),
      babel({
        ...babelConfig,
        babelHelpers: 'runtime',
      }),
      commonjs({
        include: /node_modules/,
      }),
      typescript({ sourceMap: false }),
    ],
  };
}

export async function rollupTransform(options: BuildOptions) {
  const { output, ...rest } = getRollupConfig(options);
  const bundle = await rollup(rest);
  await bundle.write(output as OutputOptions);
  await bundle.close();
}
