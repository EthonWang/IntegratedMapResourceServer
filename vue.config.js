const packageInfo = require('./package.json'); // 这里拿到package.json的相关信息
module.exports = {
    publicPath: "./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径

    devServer: {
        port: 8885,     // 端口
    },
    // lintOnSave: false   // 取消 eslint 验证
    pages: {
        index: {
          // page 的入口
          entry: 'src/main.js',
          // 模板来源
          template: 'public/index.html',
          // 在 dist/index.html 的输出
          filename: 'index.html',
          // 在这个页面中包含的块，默认情况下会包含
          // 提取出来的通用 chunk 和 vendor chunk。
          chunks: ['chunk-vendors', 'chunk-common', 'index'],
          meta: {revised: `版本号, ${packageInfo.version}`}
        },
      }    
};