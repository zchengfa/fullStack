<template>
  <div class="goods-data-item" >
    <div class="list-box">
      <div class="list-image" @click="itemClick"><img :src="list.imagePath || list.product_image" alt="itemImage" @load="imageLoad"></div>
      <div class="list-content">
        <div class="title">{{list.title || list.product_title}}</div>
        <div class="list-others">
          <div class="price-box">
            <span class="price">{{list.price || list.product_price}}</span>
            <span class="origin_price">{{list.origin_price}}</span>
          </div>
          <div class="love-box" @click="collectFavorite(list.product_id)">
            <span :class="{active:isLove}">♡</span>
            <span class="favorite">{{list.favorite}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {changeUserProductCollectionStatus} from "@/network/home";

  export default {
    name: "GoodsDtaItem",
    props:{
      list:{
        type:Object,
        default(){
          return {}
        }
      },
      type:{
        type:String,
        default() {
          return ''
        }
      },
      userCollections: {
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {
        isLove:false,
        clickCount:0,
        userCollection: []
      }
    },
    watch:{
      userCollections:function (newV){
        this.userCollection = newV
      }
    },
    mounted() {
      setTimeout(()=>{
        for (const collectionKey in this.userCollection) {
          if (this.userCollection[collectionKey].product_id === this.list.product_id)
            this.isLove = true
        }
      },0)
    },
    methods:{
      collectFavorite(product_id){
        //点击按钮先判断用户是否已经登录，若未登录，引导用户进入登录页面，若已经登录，执行收藏操作
        if (this.$store.state.token){
          let userInfo = this.$store.state.userInfo
          //点击当前商品的收藏按钮，先判断当前用户是否已经收藏了该商品，如果是已经收藏了商品，说明当前用户需要取消该商品的收藏，反之则执行收藏商品请求
          if (this.isLove){
            changeUserProductCollectionStatus(userInfo.user_id,product_id,1).then(res =>{
              if (res.data.current_status === false){
                this.$props.list.favorite = Number(this.$props.list.favorite) -1
                this.isLove = res.data.current_status
                this.$toast.showToast('取消收藏')
              }
            }).catch(err =>{
              this.$toast.showToast(err)
            })
          }
          //为收藏商品，点击按钮，收藏当前商品
          else {
            changeUserProductCollectionStatus(userInfo.user_id,product_id,0).then(res =>{
              if (res.data.current_status === true){
                this.$props.list.favorite = Number(this.$props.list.favorite) +1
                this.isLove = res.data.current_status
                this.$toast.showToast('收藏成功')
              }
            }).catch(err =>{
              this.$toast.showToast(err)
            })
          }
        }
        //用户未登录，引导用户进入登录页面
        else {
          this.$router.push('/login')
        }
      },
      //监听图片是否加载完成(原生的js监听img.onLoad = function())
      //vue监听图片加载,在img标签加上@load = “方法”，在methods实现方法
      imageLoad(){
        //通过this.$bus.emit()发送给事件总线（使用$bus之前需在main.js文件中将Vue实例给$bus（事件总线）并添加到Vue原型上）
        this.$bus.$emit('itemImageLoad')
      },
      itemClick(){
        //动态路由传参(先要从父组件传入id和type给子组件)
        this.$router.push('/detail/'+this.type +'/'+(this.list.product_id))
        console.log(this.$router.push('/detail/'+this.type +'/'+(this.list.product_id)))

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
  .love-box span:first-child{
    font-size: 1.01rem;
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
