import {URL} from "./src/common/utils";

module.exports = {
    configureWebpack: {
        resolve:{
            alias:{
                'assets':'@/assets',
                'common':'@/common',
                'components':'@components',
                'views':'@/views',
                'network':'@/network'
            }
        }
    },
    // devServer:{
    //     proxy:{
    //         '/admin':{
    //             target:'http://192.168.31.130:3000',  // 后台接口域名
    //             // ws: true,        //如果要代理 websockets，配置这个参数
    //             secure: false,  // 如果是https接口，需要配置这个参数
    //             changeOrigin: true,  //是否跨域
    //             // pathRewrite:{
    //             //     '^/admin':''
    //             // }
    //         }
    //     }
    // }
}