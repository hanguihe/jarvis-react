// import { default as EsBuildPlugin } from 'esbuild-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WebpackBar from 'webpackbar';

// @ts-ignore
export default {
  entry: `${process.cwd()}/src`,
  output: {
    filename: 'jarvis.[hash:8].js',
    path: `${process.cwd()}/dist`,
  },
  stats: 'none',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [new EsBuildPlugin({})],
  // },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(bmp|gif|jpe?g|png)$/,
        use: {
          loader: require.resolve('url-loader'),
          options: {
            name: 'static/assets/[name].[hash:8].[ext]',
            limit: 1024 * 10,
          },
        },
      },
      {
        test: /.(tsx|ts|jsx|js)$/,
        loader: require.resolve('babel-loader'),
        exclude: `${process.cwd()}/node_modules`,
        include: `${process.cwd()}/src`,
        options: {
          presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
          plugins: [
            // require.resolve('react-refresh/babel'),
            [
              require.resolve('@babel/plugin-proposal-decorators'),
              { decoratorsBeforeExport: true },
            ],
            [
              require.resolve('babel-plugin-import'),
              {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: `${process.cwd()}/public/index.html`,
    }),
  ],
};
