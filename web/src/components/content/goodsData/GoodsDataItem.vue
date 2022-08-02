<template>
  <div class="goods-data-item">
    <div class="list-box">
      <trademark></trademark>
      <div class="list-image" @click="itemClick">
        <img v-lazy="list['imagePath'] || list['product_image']" alt="itemImage" class="image-data" @load="imageLoad">
        <!--      售罄-->
        <div class="sell-out" v-if="list['stocks']===0">
          <div class="sell-out-content">
            <span>已售罄</span>
          </div>
        </div>
      </div>
      <div class="list-content">
        <div class="title">{{list.title || list['product_title']}}</div>
        <div class="list-others">
          <div v-if="list.self_support" class="self-support">
            <span>自营</span>
            <span>mall自营</span>
          </div>
          <div class="preferential" v-if="list.isPreferential || list.isHot">
            <span class="preferential">优惠：</span>
            <span v-show="list.isPreferential" class="discount">{{list.preferential_type}}</span>
            <span v-show="list.isHot" class="hot">热卖</span>
          </div>
          <div class="price-box">
            <span class="price">￥{{list.price}}</span>
            <span class="origin_price">{{originPrice}}</span>
          </div>
          <div class="love-box" @click="collectFavorite(list.product_id)">
            <span :class="{active:list.isCollected}">♡</span>
            <span class="favorite">{{list.favorite}}</span>
          </div>
          <div class="comments">
            <span>近期{{list['comment_number']}}条评价</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {changeUserProductCollectionStatus} from "@/network/home";
  import Trademark from "@/components/common/trademark/Trademark";

  export default {
    name: "GoodsDtaItem",
    props:{
      list:{
        type:Object,
        default(){
          return {}
        }
      },
      id:{
        type:Number,
        default() {
          return undefined;
        }
      }
    },
    components:{
      Trademark
    },
    computed:{
      originPrice(){
        return Number((this.list.price/this.list.discount).toFixed(2))
      }
    },
    methods:{
      collectFavorite(product_id){
        //点击按钮先判断用户是否已经登录，若未登录，引导用户进入登录页面，若已经登录，执行收藏操作
        if (this.$store.state.token){
          let userInfo = this.$store.state.userInfo
          //点击当前商品的收藏按钮，先判断当前用户是否已经收藏了该商品，如果是已经收藏了商品，说明当前用户需要取消该商品的收藏，反之则执行收藏商品请求
          if (this.$props.list.isCollected){
            changeUserProductCollectionStatus(userInfo.user_id,product_id,1).then(res =>{
              if (res.data.current_status === false){
                this.$props.list.favorite = Number(this.$props.list.favorite) -1
                this.$props.list.isCollected = false
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
                this.$props.list.isCollected = true
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
        this.$router.push('/detail/'+this.list.sell_type+'/'+this.list.product_type +'/'+(this.list.product_id)+'/'+this.$props.id)
      }
    }
  }
</script>

<style scoped>
  .active{
    color: #ff0000;
  }
  .goods-data-item{
    position: relative;
    width: 46%;
    margin: 1rem auto;
    overflow: hidden;
  }
  .list-box img{
    width: 100%;
    background-size: contain;
    border-radius: .3rem;
  }
  .list-image{
    position: relative;
  }
  .title{
    margin: .6rem auto;
    width: 98%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000;
  }
  .price-box,
  .love-box{
    position: relative;
    display: inline-block;
    margin-top:.5rem;
  }
  .love-box{
    width: 30%;
  }
  .price-box{
    width:70%;
  }
  .love-box span:first-child{
    font-size: 1.01rem;
  }
  .self-support{
    width: 100%;
    color: #fff;
    text-align: left;
  }
  .self-support span{
    display: inline-block;
    margin-left: .2rem;
    padding-left: .2rem;
    padding-right: .2rem;
    background-color: #f54f2a;
    border-radius: .2rem;
    font-size: .8rem;
  }
  .preferential{
    margin-top: .5rem;
    text-align: left;
    text-indent: .2rem;
  }
  .preferential .discount,
  .preferential .hot{
    margin-left: .2rem;
    padding-right: .2rem;
    padding-left: .2rem;
    background-color: #f00;
    font-size: .8rem;
    border-radius: .2rem;
    color: #fff;
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
  .comments span{
    display: inline-block;
    margin-top: .4rem;
    width: 100%;
    text-indent: .2rem;
    text-align: left;
  }
/*  已售罄样式*/
  .sell-out{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(33, 32, 32, 0.4);
  }
  .sell-out .sell-out-content{
    position: relative;
    top:50%;
    left: 50%;
    width: 60%;
    height: 60%;
    border: .5rem dotted rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    text-align: center;
    transform: translateY(-50%) translateX(-50%);
  }
  .sell-out-content span{
    display: inline-block;
    position: relative;
    top: 50%;
    color: rgba(255, 255, 255, 0.8);
    transform: translateY(-50%);
  }
</style>
