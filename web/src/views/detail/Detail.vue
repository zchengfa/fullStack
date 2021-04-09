<template>
  <div class="detail">
    <detail-nav-bar :nav-list="nav_list"></detail-nav-bar>
    <Scroll class="content" ref="scroll">
      <detail-content :detail-data="detailData" @imageLoadOver="imageLoad"></detail-content>
    </Scroll>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/DetailNavBar";
  import DetailContent from "@/views/detail/component/DetailContent";
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
        comment_num:0
      }
    },
    components:{
      DetailNavBar,
      DetailContent,
      Scroll
    },
    computed:{
      nav_list(){
        return ["商品","参数",`评论(${this.comment_num})`,"推荐"]
      }
    },
    methods:{
      imageLoad(){
        const refresh = debounce(this.$refs.scroll.refresh, 300)
        refresh()
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
