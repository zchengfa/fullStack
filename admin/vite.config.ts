import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// @ts-ignore
import path from 'path'


// https://vitejs.dev/config/
// @ts-ignore
// @ts-ignore
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
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
  build: {
    rollupOptions:{
      output:{
        manualChunks(id){
          if(id.includes('node_modules')){
            // 通过文件路径分割 node_modules 依赖
            return id.toString().split("node_modules/")[1].split("/")[0].toString()
          }
        }
      }
    }
  }
  /**
   * @description resolve设置别名，当引入路径中出现了@表示从src文件夹开始查找
  */
  // resolve:{
  //   alias:{
  //     '@':resolve(__dirname,'./src')
  //   }
  // }
})
