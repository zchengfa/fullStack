import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import * as path from "node:path";
import viteImagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    //解除unplugin-auto-import和ElementPlusResolver的注释，实现组件/API按需加载：
    AutoImport({
      resolvers: [ElementPlusResolver()], // 压缩样式
      dts: './auto-imports.d.ts' // 生成类型声明文件
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['./components'] // 指定组件目录
    }),
    //开启Gzip压缩
    viteCompression({ algorithm: 'gzip', ext: '.gz' }), // Gzip
    //开启Brotli压缩
    viteCompression({
      algorithm: 'brotliCompress', // 指定使用 Brotli 算法
      ext: '.br',                 // 生成 .br 后缀的压缩文件
      threshold: 1024,            // 仅压缩大于 1KB 的文件（默认值）
      deleteOriginFile: false,     // 保留原始文件（避免服务器未启用 Brotli 时无法回退）
      filter: /\.(js|css|html|svg|json)$/i // 压缩指定类型的文件
    }),    //Brotli
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,      // 高压缩级别
        interlaced: false          // 禁用隔行扫描提升压缩率
      },
      optipng: {
        optimizationLevel: 7       // PNG最高压缩级别
      },
      mozjpeg: {
        quality: 70,               // 平衡质量与体积
        progressive: true          // 渐进式加载优化体验
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false }, // 保留SVG viewBox
          { name: 'removeEmptyAttrs', active: true }
        ]
      },
      pngquant: {
        quality: [0.7, 0.9],       // 压缩范围更激进
        speed: 4
      },
      webp: {
        quality: 75,               // WebP质量适中
        lossless: false
      },
      disable: false,           // 开发环境禁用压缩
      verbose: true                // 显示压缩日志
    }),
    //开启包体积可视化分析
    visualizer({ open: true, filename: 'stats.html' })
  ],
  build:{
    terserOptions: {
      compress: {
        drop_console: true,  // 移除console语句
        pure_funcs: ['console.info']  // 保留特定console类型
      },
      format: {
        comments: false  // 删除注释
      }
    },
    //启用css代码分割
    cssCodeSplit:true,
    rollupOptions:{
      //若使用cdn引入第三方包则使用该属性，这些包不会打包进产物中
      //external:['vue','vue-router'],
      input:{
        main: path.resolve(__dirname, './index.html'),
      },
      output:{
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('element-plus')) {
              return 'vue-element-plus-vendor'; // 将vue和element-plus打包到一起
            }
            if (id.includes('axios')) return 'axios';
            if(id.includes('echarts')) return 'echarts-vendor';
            // 通过文件路径分割 node_modules 依赖
            //return id.toString().split("node_modules/")[1].split("/")[0].toString();
            return 'vendor';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js'
      }
    }
  },
  server:{
    //localhost
    host:'0.0.0.0',
    //端口
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
