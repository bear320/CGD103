const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 入口文件
    // app --> chunks
    entry: { index: "./src/index.js", about: "./src/about.js" },
    // 出口文件
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    // 處裡對應模組
    module: {
        rules: [
            {
                // 格式
                test: /\.(sass|scss|css)$/,
                //順序是由下到上 css > style
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./dist",
                        },
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    // 對應的插件
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./[name].css",
        }),
        new HtmlWebpackPlugin({
            // 選擇注入資源 chunk
            chunks: ["index"],
            // 預設 <body> js </body>  head or body
            inject: "body",
            // 來源
            template: "./src/index.html",
            // 目的地
            filename: "index.html",
        }),
        new HtmlWebpackPlugin({
            // 選擇注入資源 chunk
            chunks: ["about"],
            // 預設 <body> js </body>  head or body
            inject: "body",
            // 來源
            template: "./src/about.html",
            // 目的地
            filename: "about.html",
        }),
    ],
    // 服務器配置
    // devServer: {},
    // 開發模式配置 --> production / development
    mode: "development",
};
