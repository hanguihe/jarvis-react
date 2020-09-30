import webpack from 'webpack';

export default {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 3000,
    open: false,
    compress: true,
    hot: true,
    hotOnly: false,
    clientLogLevel: 'none',
    stats: 'none',
    quiet: true,
    overlay: true,
  },
  module: {
    rules: [
      {
        test: /.(css)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: false,
            },
          },
        ],
      },
      {
        test: /.(less)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: false,
            },
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
