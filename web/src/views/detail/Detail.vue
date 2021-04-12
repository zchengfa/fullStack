<template>
  <div class="detail">
    <detail-nav-bar :nav-list="nav_list" @scrollThere="scrollThere" ref="detailNav"></detail-nav-bar>
    <Scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <div class="shop-show" v-if="Object.keys(detailData).length !==0">
        <detail-shop ref="shop" :base-data="detailData"></detail-shop>
        <detail-image ref="image" :images-data="detailData.images" @imageLoadOver="imageLoad"></detail-image>
        <detail-params ref="params" :params="detailData.shop_detail_params"></detail-params>
        <detail-comment ref="comment" :comment-num="Number(comment_num)"></detail-comment>
        <detail-recommend ref="recommend" :recommend-data="detailData.shop_recommend"></detail-recommend>
      </div>
      <div class="shop-hidden" v-else>
        <detail-empty></detail-empty>
      </div>
    </Scroll>
    <back-top v-show="isShowBackTop" @click.native="backTop"></back-top>
    <detail-add-cart :product-info="productInfo" v-if="isShowAddCart" @submitAdd="submitAdd"></detail-add-cart>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/navBar/DetailNavBar";
  import DetailShop from "@/views/detail/component/content/DetailShop";
  import DetailParams from "@/views/detail/component/content/DetailParams";
  import DetailComment from "@/views/detail/component/content/DetailComment";
  import DetailImage from "@/views/detail/component/content/DetailImage";
  import DetailRecommend from "@/views/detail/component/content/DetailRecommend";
  import DetailEmpty from "@/views/detail/component/content/DetailEmpty";
  import DetailBottomBar from "@/views/detail/component/bottom/DetailBottomBar";
  import DetailAddCart from "@/views/detail/component/bottom/DetailAddCart";

  import BackTop from "@/components/content/backTop/BackTop";
  import Scroll from "@/components/common/scroll/Scroll";

  import {getGoodsDetail} from "@/network/home"
  import {debounce} from "@/common/utils"

  import mixins from "@/mixins/mixins";

  export default {
    name: "detail",
    mixins:[mixins],
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
        productInfo:{}
      }
    },
    components:{
      DetailNavBar,
      DetailShop,
      DetailParams,
      DetailComment,
      DetailImage,
      DetailRecommend,
      DetailEmpty,
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
        this.isShowAddCart = !this.isShowAddCart
        this.productInfo.title = this.detailData.title
        this.productInfo.image = this.detailData.bigImage
        this.productInfo.price = this.detailData.price
      },
      submitAdd() {
        this.isShowAddCart = !this.isShowAddCart
        this.$store.commit('addCart',this.productInfo)
      }
    }
    ,
    created() {
      //将路由传过来的参数赋值给id和type
      this.id = this.$route.params.product_id -1
      this.type = this.$route.params.product_type

      //将id和type作为参数进行请求
      getGoodsDetail(this.type,this.id).then(res=> {
        //将请求到的数据赋给detailData
        this.detailData = res.data[0].product_detail[0]
        //获取detailData中的评论数据
        this.comment_num = this.detailData.comment_num
      }).catch(() => {
        //当请求的数据为空时，detailData的数据为空对象
        this.detailData = {}
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
    bottom: 6rem;
    height: calc(100% - 44px);
    overflow: hidden;
    z-index: 9;
  }

</style>
