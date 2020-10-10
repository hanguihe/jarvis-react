import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default (env: string = 'production'): Configuration => {
  const cwd = process.cwd();
  const resolve = (name: string) => require.resolve(name);
  const isDev = env === 'development';

  const getStyleLoaders = (type: string = 'css') =>
    [
      isDev && resolve('style-loader'),
      !isDev && {
        loader: MiniCssExtractPlugin.loader,
        options: { esModule: true },
      },
      {
        loader: resolve('css-loader'),
        options: {
          importLoaders: Number(type === 'css'),
          modules: false,
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

  return {
    mode: env,
    entry: `${cwd}/src`,
    output: {
      filename: 'jarvis.[hash:8].js',
      path: `${cwd}/dist`,
    },
    devtool: isDev ? 'cheap-module-source-map' : 'none',
    stats: 'none',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.(bmp|gif|jpe?g|png)$/,
          use: {
            loader: resolve('url-loader'),
            options: {
              name: 'static/assets/[name].[hash:8].[ext]',
              limit: 1024 * 10,
            },
          },
        },
        {
          test: /.(tsx|ts|jsx|js)$/,
          loader: `${resolve('babel-loader')}?cacheDirectory`,
          exclude: `${cwd}/node_modules`,
          include: `${cwd}/src`,
          options: {
            presets: [
              resolve('@babel/preset-env'),
              resolve('@babel/preset-react'),
            ],
            plugins: [
              // 使用react官方最新热更新方案
              isDev && resolve('react-refresh/babel'),
              [
                resolve('@babel/plugin-proposal-decorators'),
                { decoratorsBeforeExport: true },
              ],
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
          use: getStyleLoaders('css'),
        },
        {
          test: /\.(less)$/,
          use: getStyleLoaders('less'),
        },
      ],
    },
    plugins: [
      new WebpackBar(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: `${cwd}/public/index.html`,
      }),
      // 当前官方方案并不完美，需要设置window全局属性，故引入社区plugin减少配置
      isDev && new ReactRefreshPlugin(),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: 'jarvis.[hash:8].css',
        }),
    ].filter(Boolean),
  } as Configuration;
};
