module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'views': '@/views',
        'network': '@/network'
      }
    },
    //图片压缩
    // module: {
    //   rules: [
    //     {
    //       test: /\.(png|jpe?g|gif|webp)$/i,
    //       use: [
    //         {
    //           loader: 'url-loader',
    //           options: {
    //             limit: 10000,
    //             name: 'img/[name].[hash:8].[ext]',
    //           },
    //         },
    //         {
    //           loader: 'image-webpack-loader',
    //           options: {
    //             mozjpeg: {
    //               progressive: true,
    //               quality: 65,
    //             },
    //             optipng: {
    //               enabled: false,
    //             },
    //             pngquant: {
    //               quality: [0.65, 0.9],
    //               speed: 4,
    //             },
    //             gifsicle: {
    //               interlaced: false,
    //             },
    //             webp: {
    //               quality: 75,
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },
  },
  //关闭eslint检测
  lintOnSave: false,
  publicPath: '/',
  //设置代理解决跨域问题
  devServer: {
    proxy: {
      '/api': {
        target: 'http://apis.juhe.cn/fapig/douyin',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }


}