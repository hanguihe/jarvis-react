import { Configuration, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { resolveProjectFile } from '../util/function';
import { getBabelConfig } from './babel';
import { BuildOptions } from '../type';

export function getWebpackConfig(options: BuildOptions) {
  const env = process.env.NODE_ENV;
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';

  const babelConfig = getBabelConfig('esm', options);

  const getStyleRules = (type: 'css' | 'less') =>
    [
      isDevelopment && require.resolve('style-loader'),
      isProduction && { loader: MiniCssExtractPlugin.loader },
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: type === 'css' ? 1 : 2,
          sourceMap: isDevelopment,
          modules: {
            auto: true,
          },
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          sourceMap: isDevelopment,
          postcssOptions: {
            ident: 'postcss',
            plugins: [
              'postcss-flexbugs-fixes',
              [
                'postcss-preset-env',
                {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                },
              ],
              'postcss-normalize',
            ],
          },
        },
      },
      type === 'less' && {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
            // TODO userconfig
            modifyVars: {},
          },
        },
      },
    ].filter(Boolean);

  return {
    mode: env,
    // 生产环境构建错误直接退出整个流程
    bail: isProduction,
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    entry: resolveProjectFile('src/app.tsx'),
    output: {
      path: resolveProjectFile('dist'),
      filename: isDevelopment ? 'jarvis.js' : 'jarvis.[contenthash:8].js',
      chunkFilename: isDevelopment ? 'jarvis-chunk.js' : 'jarvis.[contenthash:8]-chunk.js',
      publicPath: isDevelopment ? '/' : './',
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: resolveProjectFile('node_modules/.cache'),
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    resolve: {
      modules: ['node_modules', resolveProjectFile('node_modules')],
      extensions: ['.tsx', '.ts', '.jsx', 'jsx'],
      alias: {
        '@': resolveProjectFile('src'),
      },
    },
    performance: false,
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
              options: {
                ...babelConfig,
              },
            },
            {
              test: /\.css$/,
              use: [...getStyleRules('css')],
            },
            {
              test: /\.less/,
              use: [...getStyleRules('less')],
            },
            {
              exclude: [/\.(ts?x|js?x|html|json)$/],
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
      isDevelopment && new ProgressPlugin(),
      isDevelopment && new HotModuleReplacementPlugin(),
      isDevelopment &&
        new ReactRefreshPlugin({
          overlay: false,
        }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8]-chunk.css',
        }),
    ].filter(Boolean),
  } as Configuration;
}
