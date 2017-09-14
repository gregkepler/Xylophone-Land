/* eslint-env node */
const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var nodeModulesPath     = path.resolve(__dirname, 'node_modules');
var projectRoot         = path.resolve(__dirname, 'src')
var buildPath           = path.resolve(__dirname, 'build');
var mainPath            = path.resolve(__dirname, 'src', 'app.js');
var tonePath            = path.resolve(nodeModulesPath, 'tone/build', 'Tone.js');

var config = {
    devtool: 'source-map',
    entry: [
        mainPath
    ],
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: ''
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: projectRoot,
                exclude: [nodeModulesPath],
                loader: 'babel-loader',
                query: {
                    compact: true,
                    presets: [
                        ['es2015', {modules: false}]
                    ]
                }
            },
            {
                test: /\.css$/,
                include: projectRoot,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(glsl|frag|vert)$/,
                include: projectRoot,
                loader: 'raw-loader',
                exclude: [nodeModulesPath],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Xylophone Land',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            'THREE': 'three'
        }),
        new webpack.ProvidePlugin({
            'Tone': tonePath
        }),
    ],
};

module.exports = config;