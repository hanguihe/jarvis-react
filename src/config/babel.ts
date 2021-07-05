import babel, { TransformOptions } from '@babel/core';
import { BuildOptions } from '../type';

export function getBabelConfig(type: 'cjs' | 'esm', options?: BuildOptions) {
  const mode = options?.mode || 'app';
  const env = process.env.NODE_ENV;
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';

  return {
    babelrc: false,
    configFile: false,
    cacheDirectory: mode === 'app',
    cacheCompression: false,
    compact: mode === 'app' && isProduction,
    sourceType: 'unambiguous',
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: false,
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          runtime: 'automatic',
        },
      ],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      isDevelopment && require.resolve('react-refresh/babel'),
      // 打包app时引入runtime
      mode === 'app' && require.resolve('@babel/plugin-transform-runtime'),
      // 打包组件时需要转换引入的文件 less → css
      mode === 'component' && [
        {
          name: 'rename-less',
          visitor: {
            ImportDeclaration: (path: any) => {
              if (path.node.source.value.endsWith('.less')) {
                path.node.source.value = path.node.source.value.replace(/\.less$/, '.css');
              }
            },
          },
        },
      ],
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        },
      ],
    ].filter(Boolean),
  } as TransformOptions;
}

export default function babelTransform(type: 'cjs' | 'esm', file: any) {
  const config = getBabelConfig(type);

  return (
    babel.transform(file.contents, {
      ...config,
      filename: file.path,
    })?.code || ''
  );
}
