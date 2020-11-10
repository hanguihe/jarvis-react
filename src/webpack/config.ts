import { Configuration, ProgressPlugin } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import FriendlyWebpackPlugin from 'friendly-errors-webpack-plugin';
import { default as ESBuildPlugin } from 'esbuild-webpack-plugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

function resolve(name: string) {
  return require.resolve(name);
}

function join(name: string) {
  return `${process.cwd()}/${name}`;
}

function getStyleLoaders(type: 'css' | 'less', isDev: boolean) {
  return [
    isDev && resolve('style-loader'),
    !isDev && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
      },
    },
    {
      loader: resolve('css-loader'),
      options: {
        importLoaders: Number(type === 'css'),
        sourceMap: isDev,
        modules: {
          auto: true,
        },
      },
    },
    type === 'less' && {
      loader: resolve('less-loader'),
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  ].filter(Boolean);
}

export default function () {
  const env = process.env.NODE_ENV;
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';

  return {
    mode: env,
    entry: join('src/app'),
    output: {
      filename: 'jarvis.[hash:8].js',
      chunkFilename: 'jarvis-chunk.[hash:9].js',
      path: join('dist'),
      publicPath: './',
    },
    devtool: isDevelopment ? 'cheap-module-source-map' : 'none',
    stats: isDevelopment
      ? 'none'
      : {
          all: false,
          assets: true,
          builtAt: true,
          errors: true,
          errorDetails: true,
          timings: true,
          version: true,
          warnings: true,
        },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': join('src'),
      },
    },
    optimization: {
      // minimizer: [new ESBuildPlugin()],
      splitChunks: {
        chunks: 'all',
      },
    },
    performance: false,
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(bmp|gif|jpe?g|png)$/,
              use: {
                loader: resolve('url-loader'),
                options: {
                  name: 'static/assets/[name].[ext]',
                  limit: 8192,
                },
              },
            },
            {
              test: /.(tsx|ts|jsx|js)$/,
              loader: resolve('babel-loader'),
              include: join('src'),
              options: {
                compact: isProduction,
                cacheDirectory: isDevelopment,
                cacheCompression: false,
                presets: [
                  resolve('@babel/preset-react'),
                  resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  // isDevelopment && resolve('react-refresh/babel'),
                  [
                    resolve('babel-plugin-import'),
                    {
                      libraryName: 'antd',
                      libraryDirectory: 'es',
                      style: true,
                    },
                  ],
                ].filter(Boolean),
              },
            },
            {
              test: /\.(css)$/,
              use: getStyleLoaders('css', isDevelopment),
            },
            {
              test: /\.(less)$/,
              use: getStyleLoaders('less', isDevelopment),
            },
            {
              loader: 'file-loader',
              exclude: [/\.(ts|tsx|js|jsx|mjs)$/, /\.html$/, /\.json/],
              options: {
                name: 'static/asset/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['dist'],
      }),
      new HtmlWebpackPlugin({
        template: join('public/index.html'),
        filename: 'index.html',
      }),
      isDevelopment && new ProgressPlugin(),
      // isDevelopment && new ReactRefreshPlugin(),
      isDevelopment && new FriendlyWebpackPlugin(),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[hash:8].css',
          chunkFilename: '[name].[hash:8].css',
          ignoreOrder: true,
        }),
    ].filter(Boolean),
  } as Configuration;
}
