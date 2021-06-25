import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { HotModuleReplacementPlugin, ProgressPlugin, } from 'webpack';
import { resolveProjectFile } from '../util/function';
export default function (env) {
    const isDevelopment = env === 'development';
    const isProduction = env === 'production';
    const cssRules = [
        isDevelopment && require.resolve('style-loader'),
        isProduction && { loader: MiniCssExtractPlugin.loader },
        {
            loader: require.resolve('css-loader'),
            options: {
                sourceMap: isDevelopment,
                modules: {
                    auto: true,
                },
            },
        },
    ].filter(Boolean);
    return {
        mode: env,
        bail: isProduction,
        devtool: isDevelopment ? 'cheap-module-source-map' : false,
        entry: resolveProjectFile('src/app.tsx'),
        output: {
            path: resolveProjectFile('dist'),
            filename: isDevelopment ? 'jarvis.js' : 'jarvis.[contenthash:8].js',
            chunkFilename: isDevelopment
                ? 'jarvis-chunk.js'
                : 'jarvis.[contenthash:8]-chunk.js',
            publicPath: isDevelopment ? '/' : './',
        },
        cache: {
            type: 'filesystem',
            cacheDirectory: resolveProjectFile('node_modules/.cache'),
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
            modules: ['node_modules'],
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                '@': resolveProjectFile('src'),
            },
        },
        performance: false,
        module: {
            strictExportPresence: true,
            rules: [
                { parser: { requireEnsure: false } },
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
                                babelrc: false,
                                configFile: false,
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: isProduction,
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
                                    require.resolve('@babel/plugin-transform-runtime'),
                                    [
                                        require.resolve('babel-plugin-import'),
                                        {
                                            libraryName: 'antd',
                                            libraryDirectory: 'es',
                                            style: true,
                                        },
                                    ],
                                ].filter(Boolean),
                                sourceType: 'unambiguous',
                            },
                        },
                        {
                            test: /\.css$/,
                            // @ts-ignore
                            use: [...cssRules],
                        },
                        {
                            test: /\.less$/,
                            use: [
                                // @ts-ignore
                                ...cssRules,
                                // @ts-ignore
                                {
                                    loader: require.resolve('less-loader'),
                                    options: {
                                        lessOptions: {
                                            modifyVars: {},
                                            javascriptEnabled: true,
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            exclude: [/\.(js|jsx|ts|tsx|html|json)$/],
                            type: 'asset/resource',
                        },
                    ],
                },
            ],
        },
        // @ts-ignore
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
    };
}
