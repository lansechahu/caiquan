const pkg = require('./package.json');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    entry: './src/js/index.js',
    output: {
        path: __dirname + "/build",
        filename: 'js/main.min.js',
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: './build',
        disableHostCheck: true
    },
    plugins: [
        //new UglifyJSPlugin(),
        new CleanWebpackPlugin(['build/js', 'build/index.html']),
        new HtmlWebpackPlugin(
            {
                template: "./index.html",
                chunksSortMode: "none"
            }
        )
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}