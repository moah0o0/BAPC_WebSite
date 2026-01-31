const { defineConfig } = require('@vue/cli-service')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // EditorJS 별도 chunk (관리자만 사용)
          editorjs: {
            name: 'editorjs',
            test: /[\\/]node_modules[\\/](@editorjs|editorjs)/,
            priority: 20,
            chunks: 'async',
          },
          // Vue 관련 라이브러리
          vue: {
            name: 'vue-vendor',
            test: /[\\/]node_modules[\\/](vue|vue-router|@vue)/,
            priority: 10,
          },
          // 나머지 vendor
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
        },
      },
    },
  },
})