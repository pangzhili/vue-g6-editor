'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const port = 9528

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: null
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        output: {
            libraryExport: 'default'
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        config.when(process.env.NODE_ENV === 'development',
            config => config.devtool('cheap-source-map')
        )
    }
}