<template>
  <div class="goods-data-item" @click="itemClick">
    <div class="list-box">
      <div class="list-image"><img :src="list.imagePath" alt="itemImage" @load="imageLoad"></div>
      <div class="list-content">
        <div class="title">{{list.title}}</div>
        <div class="list-others">
          <div class="price-box">
            <span class="price">{{list.price}}</span>
            <span class="origin_price">{{list.origin_price}}</span>
          </div>
          <div class="love-box" @click="collectFavorite">
            <span :class="{active:isLove}">❤</span>
            <span class="favorite">{{list.favorite}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsDtaItem",
    data(){
      return {
        isLove:false,
        clickCount:0
      }
    },
    props:{
      list:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    computed:{

    },
    methods:{
      collectFavorite(){
        this.clickCount ++

        //判断点击次数来控制小红心颜色以及favorite的数量
        if(this.clickCount%2===0){
          this.isLove = !this.isLove
          this.list.favorite -=1
        }
        else {
          this.isLove = !this.isLove
          this.list.favorite +=1
        }
      },
      //监听图片是否加载完成(原生的js监听img.onLoad = function())
      //vue监听图片加载,在img标签加上@load = “方法”，在methods实现方法
      imageLoad(){
        //通过this.$bus.emit()发送给事件总线（使用$bus之前需在main.js文件中将Vue实例给$bus（事件总线）并添加到Vue原型上）
        this.$bus.$emit('itemImageLoad')
      },
      itemClick(){
        //动态路由传参
        this.$router.push('/detail/'+ this.list.product_id)
      }
    }
  }
</script>

<style scoped>
  .active{
    color: #ff0000;
  }

  .goods-data-item{
    width: 46%;
    margin: 1rem auto;
    overflow: hidden;
  }
  .list-box img{
    width: 100%;
    background-size: contain;
    border-radius: .3rem;
  }
  .title{
    margin: .6rem auto;
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price-box,
  .love-box{
    display: inline-block;

  }
  .price,.favorite{
    color: #cd5c5c;
  }
  .origin_price{
    padding-left: .6rem;
    padding-right: .6rem;
    text-decoration: line-through;
    font-size: 12px;
  }
</style>
