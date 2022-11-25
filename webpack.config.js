const path = require("path");

module.exports = {
    // 入口文件
    entry: "./src/index.js",
    // 出口文件
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
    },
    // 處裡對應模組
    // module: {},
    // 對應的插件
    // plugins: [],
    // 服務器配置
    // devServer: {},
    // 開發模式配置 --> production / development
    mode: "development",
};
