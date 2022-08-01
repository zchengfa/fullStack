import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host:'0.0.0.0',
    port:3001
    /**
     * @description proxy正向代理解决跨域问题，当请求地址中有/api时，代理会将地址拼接[target][/api],最后通过rewrite重写地址，将地址中的/api去除变成真实请求的地址，
     * 本项目的后端已经开启了cors跨域，所以前端无需启用proxy代理
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
  // resolve:{
  //   alias:{
  //     '@':resolve(__dirname,'./src')
  //   }
  // }
})
