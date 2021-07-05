import commonjs from '@rollup/plugin-commonjs';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { getBabelConfig } from './babel';
import { resolveProjectFile } from '../util/function';

export function getRollupConfig() {
  const babelConfig = getBabelConfig('cjs') as RollupBabelInputPluginOptions;

  return {
    input: resolveProjectFile('src/index.ts'),
    output: {
      file: 'dist/index.js',
      format: 'umd',
      // TODO userconfig
      name: 'Component',
      globals: {},
    },
    external: ['react', 'react-dom', 'antd', 'react/jsx-runtime'],
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        // @ts-ignore
        use: {
          less: {
            // TODO modifyVars
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
