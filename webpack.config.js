const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    // 入口文件
    // app --> chunks
    entry: {
        index: "./src/index.js",
        about: "./src/about.js",
    },
    // 出口文件
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].js",
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
                    // 'style-loader',//跟MiniCssExtractPlugin 會衝突所以要關掉
                    "css-loader",
                    "sass-loader",
                ],
            },
            //babel loader
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,

                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                ],
                include: path.resolve(__dirname, "src"),
            },
        ],
    },
    // 對應的插件
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "./css/[name].css",
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
    // 解決 vue 路徑問題
    resolve: {
        alias: {
            vue: "vue/dist/vue.js",
        },
    },
    // 服務器配置
    devServer: {
        contentBase: "./dist",
        host: "localhost",
        port: 3000,
        // 指定首頁檔案
        index: "index.html",
        open: true,
    },
    // 開發模式配置 --> production / development
    mode: "development",
};
