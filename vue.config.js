const vueConfig = {
    publicPath: '/',
    outputDir: 'dist',
    devServer: {
        host: '0.0.0.0',
        port: 4204,
        open: true,
        proxy: {
            '/api/v1': {
                target: 'http://172.16.78.42:8003',
                // target: 'http://127.0.0.1:8003',
                changeOrigin: true,
            },
        }
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
