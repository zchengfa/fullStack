# mall

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目中遇到的问题

#### 1.相同路由不同参数，页面不刷新
解决此问题的方法：
##### 1.1 在router-view中添加 :key="$route.fullPath"属性，该属性会将路由中的完整路径（包括携带的参数）作为router-view的唯一值，当路由path相同但携带的参数不同时，router-view也会重新渲染当前页面。
```vue
<template>
  <router-view :key="$route.fullPath"></router-view>
</template>
```
###### 缺点：不能达到组件复用，该方式会使组件销毁再创建，不够高效。

##### 1.2 在组件中使用watch来监听路由的变化
```vue
<script >
  export default {
    methods:{
      initData(){
        //获取页面数据...
      }
    },
    watch:{
      $route(to,from){
        if (to.path !== from.path){
          this.initData()
        }
      }
    }
  }
</script>
```




















