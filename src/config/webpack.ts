import { Configuration, HotModuleReplacementPlugin, ProgressPlugin, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolveProjectFile } from '../util/function';
import { BuildOptions } from '../type';
import { getBabelConfig } from './babel';

function getStyleRules(type: 'css' | 'less', options: BuildOptions) {
  const { isDevelopment, sourceMap, themes = {} } = options;

  const rules: RuleSetRule[] = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: type === 'less' ? 1 : 0,
        sourceMap: sourceMap,
        modules: {
          auto: true,
        },
      },
    },
  ];

  // 开发模式下使用style-loader
  if (isDevelopment) {
    rules.splice(0, 1, {
      loader: require.resolve('style-loader'),
    });
  }

  if (type === 'less') {
    rules.push({
      loader: require.resolve('less-loader'),
      options: {
        lessOptions: {
          modifyVars: { ...themes },
          javascriptEnabled: true,
        },
      },
    });
  }

  return rules;
}

export function getWebpackConfig(options: BuildOptions) {
  const { outDir = 'dist', sourceMap = false, isDevelopment } = options;

  const babelConfig = getBabelConfig({ ...options, buildType: 'esm' });

  const config: Configuration = {
    mode: 'production',
    bail: true,
    devtool: sourceMap ? 'cheap-module-source-map' : false,
    performance: false,
    entry: resolveProjectFile('src/app.tsx'),
    output: {
      path: resolveProjectFile(outDir),
      filename: 'jarvis.[contenthash:8].js',
      publicPath: './',
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': resolveProjectFile('src'),
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.svg$/,
              type: 'asset/inline',
            },
            {
              test: /\.(bmp|gif|jpe?g|png)$/,
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 10240,
                },
              },
            },
            {
              test: /\.(tsx|ts|jsx|js)$/,
              loader: require.resolve('babel-loader'),
              include: resolveProjectFile('src'),
              options: { ...babelConfig },
            },
            {
              test: /\.css$/,
              use: [...getStyleRules('css', options)],
            },
            {
              test: /\.less$/,
              use: [...getStyleRules('less', options)],
            },
            {
              exclude: [/\.(jsx|tsx|js|ts|html|json)$/],
              type: 'asset/resource',
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: resolveProjectFile('public/index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8]-chunk.css',
      }),
    ],
  };

  if (isDevelopment) {
    config.mode = 'development';
    config.devtool = 'cheap-module-source-map';
    config.output!.publicPath = '/';
    config.output!.filename = 'jarvis.js';

    config.cache = {
      type: 'filesystem',
      cacheDirectory: resolveProjectFile('node_modules/.cache'),
    };

    config.optimization!.minimize = false;

    config.plugins!.pop();
    config.plugins!.push(
      new ProgressPlugin(),
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    );
  }

  return config;
}
