/* eslint-disable */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    // mode: "production",
    mode: "development",
    entry: {
        background: __dirname + "/src/background.ts",
        options: __dirname + "/src/options.ts",
        changelog: __dirname + "/src/changelog.ts"
    },
    devtool: "source-map",
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "src/options.html",
            filename: "options.html",
            chunks: ["options"],
            cache: false
        }),
        new HtmlWebpackPlugin({
            template: "src/changelog.html",
            filename: "changelog.html",
            chunks: ["changelog"],
            cache: false
        }),
        new copyWebpackPlugin({
            patterns: [
                { from: "src/manifest.json" },
                {
                    from: "src/icons/",
                    to: "icons",
                    toType: "dir"
                }
            ]
        })
    ],
    optimization: {
        usedExports: true
    //     splitChunks: {
    //         chunks: "all"
    //     }
    }
}
