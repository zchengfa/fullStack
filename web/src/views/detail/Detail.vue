<template>
  <div class="detail">
    <detail-nav-bar :nav-list="nav_list" @scrollThere="scrollThere" ref="detailNav"></detail-nav-bar>
    <Scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <div class="shop-show" v-if="Object.keys(detailData).length">
        <detail-base ref="base" class="detail-base" :base-data="detailData.baseData"></detail-base>
        <detail-image ref="image" :images-data="detailData.images" @imageLoadOver="imageLoad"></detail-image>
        <detail-params ref="params" :params="detailData.shop_detail_params"></detail-params>
        <detail-comment ref="comment" :comment-num="Number(comment_num)"></detail-comment>
        <Recommend ref="recommend" :recommend-data="detailData.shop_recommend" recommend-title="商品推荐"></Recommend>
      </div>
    </Scroll>
    <back-top v-show="isShowBackTop" @click.native="backTop"></back-top>
    <detail-add-cart :product-info="productInfo" v-if="isShowAddCart" @submitAdd="submitAdd"></detail-add-cart>
    <detail-bottom-bar ref="detailBottomBar" @addCart="addCart" :is-collected="isCollected" @collectProduct="collectProduct"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/navBar/DetailNavBar";
  import DetailBase from "@/views/detail/component/content/DetailBase";
  import DetailParams from "@/views/detail/component/content/DetailParams";
  import DetailComment from "@/views/detail/component/content/DetailComment";
  import DetailImage from "@/views/detail/component/content/DetailImage";
  import DetailBottomBar from "@/views/detail/component/bottom/DetailBottomBar";
  import DetailAddCart from "@/views/detail/component/bottom/DetailAddCart";

  import Recommend from "@/components/content/recommend/Recommend";
  import BackTop from "@/components/content/backTop/BackTop";
  import Scroll from "@/components/common/scroll/Scroll";

  import {getGoodsDetail,addShopToCart,getProductCollectionStatus,changeUserProductCollectionStatus} from "@/network/home"
  import {debounce} from "@/common/utils"

  import mixins from "@/common/mixins/mixins";

  import {verify} from '@/common/jsonwebtoken'

  export default {
    name: "detail",
    mixins:[mixins.backTopMixins],
    data(){
      return {
        id:null,
        type:null,
        detailData: {},
        comment_num:0,
        contentTopYs:null,
        scrollToTopY:[],
        currentRefsIndex:0,
        isShowAddCart:false,
        productInfo:{},
        token:sessionStorage.getItem('token'),
        isCollected:false
      }
    },
    components:{
      DetailNavBar,
      DetailBase,
      DetailParams,
      DetailComment,
      DetailImage,
      Recommend,
      BackTop,
      DetailBottomBar,
      DetailAddCart,
      Scroll
    },
    computed:{
      nav_list(){
        //当评论数量大于99的时候让评论数量为99+，反之则为原评论数
        if (this.comment_num>99) return ["商品","参数",`评论(99+)`,"推荐"]
        return ["商品","参数",`评论(${this.comment_num})`,"推荐"]
      }
    },
    methods:{
      imageLoad(){
        //防抖函数处理scroll组件的刷新
        const refresh = debounce(this.$refs.scroll.refresh, 300)
        //每次加载完图片都让scroll组件进行刷新
        refresh()
        //每次图片加载完就获取各元素位置
        this.contentTopYs()
      },
      contentScroll(position) {
        //根据position位置来控制backTop组件的显示或隐藏(position时负数，需先转成正数再做比较)
        this.isShowBackTop = (- position.y)>1000

        //判断页面滚动的位置来决定navbar中title颜色
        let positionY = - position.y
        let length = this.scrollToTopY.length
        for (let i = 0; i<this.scrollToTopY.length; i++){
          if (this.currentRefsIndex !==i && (i < length -1 && positionY >= this.scrollToTopY[i])||(i === length -1 && positionY >= this.scrollToTopY[i])){
            this.currentRefsIndex = i
            //将i值赋给navbar中的currentIndex
            this.$refs.detailNav.currentIndex = this.currentRefsIndex
          }
        }
      },
      scrollThere(index){
        //根据点击的选项来滚动到相应选项的位置
        this.$refs.scroll.scrollTo(0,-this.scrollToTopY[index],300)
      },
      addCart(){
        //点击加入购物车按钮，先通过查看token是否存在来判定用户是否已经登录，未登录则引导用户进入登录页面，若已登录，则进入下一步操作
        if (this.token) {
          //token存在，点击加入购物车按钮，显示确认加入购物车组件，并将要加入购物车的商品信息添加到productInfo对象中
          this.isShowAddCart = !this.isShowAddCart
          this.productInfo.title = this.detailData.baseData.title
          this.productInfo.image = this.detailData.baseData.bigImage
          this.productInfo.price = this.detailData.baseData.price
        }
        //token不存在，用户未登录，引导用户进入登录页面
        else {
          this.$router.push({path:'/login'})
        }

      },
      changeUserProductCollectionStatus(user_id,product_id,status) {
        changeUserProductCollectionStatus(user_id,product_id,status).then(res => {
          if (res.data.current_status) {
            this.isCollected = res.data.current_status
            this.$toast.showToast('商品收藏成功')
          }
          else {
            this.isCollected = res.data.current_status
            this.$toast.showToast('取消收藏')
          }
        })
      },
      collectProduct() {
        //点击按钮先判断用户是否登录，若用户未登录，跳转到登录页面
        if (this.token) {
          verify(this.token, (err,decode) => {
            if (err) throw err
            else {
              //判断当前商品是在收藏状态还是未收藏状态
              if (this.isCollected) {
                //已处于收藏状态，点击按钮取消收藏
                this.changeUserProductCollectionStatus(decode.user_id,this.id,1)
              }
              else {
                //处于未收藏状态，点击按钮收藏商品
                this.changeUserProductCollectionStatus(decode.user_id,this.id,0)
              }
            }
          })

        }
        //没有token值，用户未登录，引导用户进入登录页面
        else {
          this.$router.push({path:'/login'})
        }
      },
      submitAdd(count) {
        //确认加入购物车，隐藏确认加入购物车组件，并将要加入购物车的商品数据提交给后端
        this.isShowAddCart = !this.isShowAddCart
        this.productInfo.product_count = count
        const product = this.productInfo

        addShopToCart(this.token,product.product_id,product.title,product.image,product.price,product.product_count).then(res => {
          console.log(res)
          if (res.data.message) {
            this.$toast.showToast(res.data.message)
          }
          //this.$toast.showToast(res.data.message)
        }).catch(err => {
          console.log(err)
        })
        //使用vuex状态管理来管理购物车数据
        // this.productInfo.shopCount = count
        // this.productInfo.product_id = this.id
        //将产品数据通过vuex的store分发到actions中
        // this.$store.dispatch('addCart',JSON.parse(JSON.stringify(this.productInfo)))
        //     .then(res => {
        //       this.$toast.showToast(res)
        //     })
        //     .catch(err => {
        //       this.$toast.showToast(err)
        //     })
      },
      getProductCollectionStatus(user_id,product_id) {
        getProductCollectionStatus(user_id,product_id).then(res => {
          //收藏状态为true时
          if (res.data.collection_status) {
            this.isCollected = res.data.collection_status
          }
          //收藏状态为false时
          else {
            this.isCollected = res.data.collection_status
          }
        })
      }
    }
    ,
    created() {

      //将路由传过来的参数赋值给id和type
      this.id = this.$route.params.product_id
      this.type = this.$route.params.product_type
      //console.log(this.id)

      //将id和type作为参数进行请求
      getGoodsDetail(this.type,this.id).then(res=> {
        //将请求到的数据赋给detailData
        this.productInfo.product_id = res.data[0].product_id
        this.detailData = res.data[0].product_detail[0]
        //获取detailData中的评论数据
        this.comment_num = this.detailData.baseData.comment_num
        //console.log(res)
      }).catch((err) => {
        console.log(err)
      })

      //防抖函数处理获取页面元素位置函数
      this.contentTopYs = debounce(()=>{
        this.scrollToTopY = []
        this.scrollToTopY.push(0)
        this.scrollToTopY.push(this.$refs.params.$el.offsetTop)
        this.scrollToTopY.push(this.$refs.comment.$el.offsetTop)
        this.scrollToTopY.push(this.$refs.recommend.$el.offsetTop)
      },100)

    },
    mounted() {
      setTimeout(()=>{
        this.$refs.scroll.refresh()
      },50)

      //判断该组件是否创建
      if (this.$refs.detailBottomBar) {
        //创建完页面后检测用户是否登录，若已经登录，获取该用户是否已经收藏过该商品，从而改变收藏按钮的状态，若未登录，让收藏按钮处于默认状态
        if (this.token) {
          //若用户已经登录
          verify(this.token, (err,decode) => {
            if (err) throw err
            else {
              this.getProductCollectionStatus(decode.user_id,this.id)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .detail{
    height: 100vh;
    background-color: #FFF;
  }
  .content{
    position: relative;
    height: calc(100% - 14vh);
    overflow: hidden;
    z-index: 9;
  }
  .detail-base{
    margin-top: 44px;
  }
</style>
