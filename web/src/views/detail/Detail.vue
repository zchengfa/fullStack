<template>
  <div class="detail">
    <detail-nav-bar :nav-list="nav_list" @scrollThere="scrollThere"></detail-nav-bar>
    <Scroll class="content" ref="scroll">
      <div class="shop-show" v-if="Object.keys(detailData).length !==0">
        <detail-shop ref="shop" :base-data="detailData"></detail-shop>
        <detail-params ref="params" :params="detailData.shop_detail_params"></detail-params>
        <detail-image ref="image" :images-data="detailData.images" @imageLoadOver="imageLoad"></detail-image>
        <detail-recommend ref="recommend" :recommend-data="detailData.shop_recommend"></detail-recommend>
      </div>
      <div class="shop-hidden" v-else>
        <detail-empty></detail-empty>
      </div>
    </Scroll>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/navBar/DetailNavBar";
  import DetailShop from "@/views/detail/component/content/DetailShop";
  import DetailParams from "@/views/detail/component/content/DetailParams";
  import DetailImage from "@/views/detail/component/content/DetailImage";
  import DetailRecommend from "@/views/detail/component/content/DetailRecommend";
  import DetailEmpty from "@/views/detail/component/content/DetailEmpty";
  import Scroll from "@/components/common/scroll/Scroll";

  import {getGoodsDetail} from "@/network/home"
  import {debounce} from "@/common/utils"

  export default {
    name: "detail",
    data(){
      return {
        id:null,
        type:null,
        detailData: {},
        comment_num:0,
        contentTopYs:null,
        scrollToTopY:[]
      }
    },
    components:{
      DetailNavBar,
      DetailShop,
      DetailParams,
      DetailImage,
      DetailRecommend,
      DetailEmpty,
      Scroll
    },
    computed:{
      nav_list(){
        if (this.comment_num>99) return ["商品","参数",`评论(99+)`,"推荐"]
        return ["商品","参数",`评论(${this.comment_num})`,"推荐"]
      }
    },
    methods:{
      imageLoad(){
        const refresh = debounce(this.$refs.scroll.refresh, 300)
        refresh()

        this.contentTopYs = debounce(()=>{
          this.scrollToTopY = []
          this.scrollToTopY.push(0)
          this.scrollToTopY.push(this.$refs.shop.$el.offsetTop)
          this.scrollToTopY.push(this.$refs.params.$el.offsetTop)
          this.scrollToTopY.push(this.$refs.image.$el.offsetTop)
          this.scrollToTopY.push(this.$refs.recommend.$el.offsetTop)
        },300)

        this.contentTopYs()


      },
      scrollThere(index){
        this.$refs.scroll.scrollTo(0,-this.scrollToTopY[index],300)

      }
    }
    ,
    created() {
      //将路由传过来的参数赋值给id和type
      this.id = this.$route.params.product_id -1
      this.type = this.$route.params.product_type

      //将id和type作为参数进行请求
      getGoodsDetail(this.type,this.id).then(res=> {

        this.detailData = res.data[0].product_detail[0]

        this.comment_num = this.detailData.comment_num
      }).catch(() => {
        this.detailData = {}
      })
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .detail{
    height: 100vh;
  }
  .content{
    position: relative;
    height: calc(100% - 44px);
    overflow: hidden;
    z-index: 9;
  }

</style>
