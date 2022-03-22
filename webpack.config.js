const path = require('path'); // The path module provides utilities for working with file and directory paths. 

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { ALL } = require('dns');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = { // optimization of code in dist
        splitChunks: {
            chunks: 'all'
        }
    }
    if(isProd) { // if true, add CssMinimizerPlugin and TerserPlugin plugins
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }
    return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extraLoader => {
    const loaders = [MiniCssExtractPlugin.loader, 'css-loader'];
    if (extraLoader) {
        loaders.push(extraLoader);
    }
    return loaders;
}

const plugins = () => {
    const base = [

        /**
         * Plugin for creating index.html
         */

        new HtmlWebpackPlugin({
            title: 'webpack test', // <title> webpack test </title>
            template: './index.html', // template of html structure
            minify: { // minimize
                collapseWhitespace: isProd // true or false
            }
        }),

        new CleanWebpackPlugin(), // cleans old vesrions of output files
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, "dist")
                },
            ],
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: filename('css')
        }),
        new ESLintPlugin()
    ]

    if(isProd) {
        base.push(new BundleAnalyzerPlugin());
    }
    
    return base;
}

module.exports = {
    target: 'web',
    context: path.resolve(__dirname, 'src'), // folder where all dev files are located

    /* 
    * mode: 'development' - собираем все в режиме разработки
    * mode: 'production' - собираем все в *режиме продакшн
    */
    mode: 'development', 

    /*
    * entry points, from where to start to build a project
    */
    entry: {
        main: ["@babel/polyfill", './js/index.js'],
        analytics: './js/analytics.ts'
    },

    output: {
        /*
        * [name] - means to put name of entry points to output files, if entry * points are more than 1. [contenthash] means to create hash in name of * output files, depending on their content.
        */
        filename: filename('js'), 

        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'], // definition of extensions allows to avoid extensions in imports

        alias: { // relative paths
            '@modules': path.resolve(__dirname, 'src/modules'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    plugins: plugins(),
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: cssLoaders(),
            },
            {
                test: /\.less$/i,
                use: cssLoaders('less-loader'),
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders('sass-loader'),
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource' // for images
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'  // for fonts
            },
            {
                test: /\.xml$/,
                use: 'xml-loader'
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            "@babel/preset-typescript"
                        ]
                    }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            
        ]
    }
}