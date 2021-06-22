const vueConfig = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    disableHostCheck: true,
    host: '127.0.0.1',
    port: 7006,
    open: true,
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:10000',
        changeOrigin: true,
      },
      '/apidocs.json': {
        target: 'http://172.16.97.194:7006',
        changeOrigin: true,
      },
      '/api/my/': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      }
    },
    watchOptions: {
      ignored: ['**/node_modules', '**/.#*']
    },
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
}

module.exports = vueConfig
