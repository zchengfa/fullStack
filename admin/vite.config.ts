// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// // @ts-ignore
// import path from 'path'
//
//
// // https://vitejs.dev/config/
// // @ts-ignore
// // @ts-ignore
// export default defineConfig({
//   plugins: [
//     vue(),
//     AutoImport({
//       resolvers: [ElementPlusResolver()],
//     }),
//     Components({
//       resolvers: [ElementPlusResolver()],
//     }),
//   ],
//   server:{
//     host:'0.0.0.0',
//     port:3001
//     /**
//      * @description proxy正向代理解决跨域问题，当请求地址中有/api时，代理会将地址拼接[target][/api],最后通过rewrite重写地址，将地址中的/api去除变成真实请求的地址，
//     */
//     // proxy:{
//     //   '/api':{
//     //     target:'后台接口地址',
//     //     changeOrigin:true,
//     //     rewrite:(path)=>{
//     //       return path.replace(/^\/api/,'')
//     //     }
//     //   }
//     // }
//   },
//   build: {
//     rollupOptions:{
//       output:{
//         manualChunks(id){
//           if(id.includes('node_modules')){
//             // 通过文件路径分割 node_modules 依赖
//             return id.toString().split("node_modules/")[1].split("/")[0].toString()
//           }
//         }
//       }
//     }
//   }
//   /**
//    * @description resolve设置别名，当引入路径中出现了@表示从src文件夹开始查找
//   */
//   // resolve:{
//   //   alias:{
//   //     '@':resolve(__dirname,'./src')
//   //   }
//   // }
// })
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression';
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      //开启Gzip压缩
      viteCompression({ algorithm: 'gzip', ext: '.gz' }), // Gzip
      //开启Brotli压缩
      viteCompression({
        algorithm: 'brotliCompress', // 指定使用 Brotli 算法
        ext: '.br',                 // 生成 .br 后缀的压缩文件
        threshold: 1024,            // 仅压缩大于 1KB 的文件（默认值）
        deleteOriginFile: false,     // 保留原始文件（避免服务器未启用 Brotli 时无法回退）
        filter: /\.(js|css|html|svg|json)$/i // 压缩指定类型的文件
      })    //Brotli
  ],
  build:{
    rollupOptions:{
      external:['vue','vue-router'],
      input:{
        main: path.resolve(__dirname, './index.html'),
      },
      output:{
        manualChunks: { // 手动分块第三方库
          vue: ['vue', 'vue-router'],
          axios: ['axios']
        }
      }
    }
  },
  server:{
    host:'0.0.0.0',
    port:3001
    /**
     * @description proxy正向代理解决跨域问题，当请求地址中有/api时，代理会将地址拼接[target][/api],最后通过rewrite重写地址，将地址中的/api去除变成真实请求的地址，
     */
    // proxy:{
    //   '/api':{
    //     target:'后台接口地址',
    //     changeOrigin:true,
    //     rewrite:(path)=>{
    //       return path.replace(/^\/api/,'')
    //     }
    //   }
    // }
  },
  /**
   * @description resolve设置别名，当引入路径中出现了@表示从src文件夹开始查找
   */
  resolve:{
    alias:{
      '@':resolve(__dirname,'./src')
    }
  }
})
