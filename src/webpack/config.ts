import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackBar from 'webpackbar';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack, { Configuration } from 'webpack';

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
          loader: resolve('babel-loader'),
          exclude: `${cwd}/node_modules`,
          include: `${cwd}/src`,
          options: {
            presets: [resolve('@babel/preset-env'), resolve('@babel/preset-react')],
            plugins: [
              [resolve('@babel/plugin-proposal-decorators'), { decoratorsBeforeExport: true }],
              [
                resolve('babel-plugin-import'),
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: true,
                },
              ],
            ],
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
      isDev && new webpack.HotModuleReplacementPlugin(),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: 'jarvis.[hash:8].css',
        }),
    ].filter(Boolean),
  } as Configuration;
};
