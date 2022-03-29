# mall

#### 介绍
{**以下是 Gitee 平台说明，您可以替换此简介**
Gitee 是 OSCHINA 推出的基于 Git 的代码托管平台（同时支持 SVN）。专为开发者提供稳定、高效、安全的云端软件开发协作平台
无论是个人、团队、或是企业，都能够用 Gitee 实现代码托管、项目管理、协作开发。企业项目请看 [https://gitee.com/enterprises](https://gitee.com/enterprises)}

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


#### 项目中遇到的问题

##### 一、使用mysql一次执行多条语句
```javascript
const selectOne = mysql_query.selectAll('mall_goods',`product_id = '${query.product_id}' AND sell_type = '${query.product_type}'`)
const selectTwo = mysql_query.selectFields('mall_goods_attribute','attribute_title,attribute',`product_id = '${query.product_id}'`)

connection.query(`${selectOne+';'+selectTwo}`,(err,results) =>{
    if (err) throw err
    else{
        console.log(results)
    }
})
```

##### 二、组件强制重新渲染
###### 场景：项目中多处使用了ProductSize组件，在某一ProductSize组件中进行了尺寸选择操作，想让ProductSize其他组件的选择也跟着变化
###### 问题：其他组件选择项无变化
###### 原因：组件没有重新渲染，无法显示最新操作
###### 推荐做法：改变该组件所绑定的key值，vue会根据组件中key值是否变化来进行组件的渲染

```vue

<template>
  <product-size :key="productSizeKey"></product-size>
</template>
<script>
import ProductSize from "./ProductSize";

export default {
  data() {
    return {
      productSizeKey: 0
    }
  },
  components:{
    ProductSize
  },
  methods: {
    closeAddCart() {
      //触发该方法后改变productSizeKey的值，达到组件重新渲染的目的
      this.productSizeKey += 1
    }
  }
}
</script>
```

##### 三、vue-router路由传参刷新页面后参数丢失
###### 解决：使用query传参
###### 缺点：url过长，会被用户看到参数
```vue
<tempalte>
<ul class="swiper-list">
  <li v-for="(item, index) in banner" v-show="index===mark" :key="index">
    <router-link :to="{name:'bannerDetail',query:{brand_id:item.brand_id,brand:item.brand,banner_image:item.banner_image}}" class="item">
      <img :src="item.banner_image" alt="itemImage" @load="imageLoad">
    </router-link>
  </li>
</ul>
</tempalte>

```

##### 四、事件总线中的事件被多次触发($bus)
###### 解决：在组件销毁前手动注销该事件(beforeDestroy)
###### 原因：事件总线时全局的，它不会随着组件的销毁而注销，每次切换路由时，事件的执行次数就会加一，需要手动注销
```vue
<script >
  export default ({
    beforeDestroy() {
      this.$bus.$off('需要注销的事件名')
    }
  })
</script>
```

##### 五、在better-scroll组件中嵌套原生滚动组件后，只能触发better-scroll的滚动，无法触发原生滚动组件的滚动
###### 解决：在使用了原生滚动组件内添阻止事件冒泡
###### 原因：在better-scroll组件中嵌套其他组件，触发事件时，只能触发到better-scroll的事件，并没有触发原生组件事件

```vue
<template>
  <div class="sale-list" ref="sale">
    <ul ref="saleUl">
      <li ref="saleLi" class="sale-list-item" v-for="(item,index) in flashSaleData" :key="index" @touchStart="toMoreSale">
        <button @click="toMoreSale(item.product_id)" class="sale-image"></button>
        <img  :src="item['product_image']" alt="sale_image">
        <span class="sale-price">{{'￥'+ item['price']}}</span>
      </li>
    </ul>
  </div>
</template>
<script >
  export default ({
    mounted() {
      //解决better-scroll中嵌套原生滚动组件时，原生组件无法滚动的问题（办法：在原生组件中添加触摸事件，阻止触摸事件的冒泡）
      this.$refs.saleUl.addEventListener('touchstart',(e)=>{
        e.stopPropagation()
      });
    },
  })
</script>
```

##### 六、在better-scroll嵌套的原生滚动组件内添加了阻止事件冒泡方法后，原生组件可以横向滚动了，但原生组件内的click方法无法执行，
###### 解决：1.只使用touch或者只使用click 2.将需要点击的元素换成button元素，并使用其click方式进行点击
###### 原因：touch事件与click事件冲突

```vue
<template>
  <div class="sale-list" ref="sale">
    <ul ref="saleUl">
      <li ref="saleLi" class="sale-list-item" v-for="(item,index) in flashSaleData" :key="index" @touchStart="toMoreSale">
        <button @click="toMoreSale(item.product_id)" class="sale-image"></button>
        <img  :src="item['product_image']" alt="sale_image">
        <span class="sale-price">{{'￥'+ item['price']}}</span>
      </li>
    </ul>
  </div>
</template>
```