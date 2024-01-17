const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: false,
  // chainWebpack: config => {
  //   // Add a rule for worker files
  //   config.module
  //     .rule('worker')
  //     .test(/\.worker\.js$/) // You can use a regex to match your worker files
  //     .use('worker-loader')
  //     .loader('worker-loader')
  //     .options({ inline: 'no-fallback' })
  //     .end()
  // }
})
