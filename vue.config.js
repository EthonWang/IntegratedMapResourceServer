module.exports = {
    publicPath: "./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径

    devServer: {
        port: 8885,     // 端口
    },
    // lintOnSave: false   // 取消 eslint 验证
};