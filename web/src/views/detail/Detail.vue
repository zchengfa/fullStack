<template>
  <div class="detail">
    <detail-nav-bar :nav-list="['商品','参数','评论','推荐']"></detail-nav-bar>
    <detail-content :detail-data="detailData"></detail-content>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/DetailNavBar";
  import DetailContent from "@/views/detail/component/DetailContent";

  import {getGoodsDetail} from "@/network/home"

  export default {
    name: "detail",
    data(){
      return {
        id:null,
        type:null,
        detailData: {}
      }
    },
    components:{
      DetailNavBar,
      DetailContent
    },
    created() {
      //将路由传过来的参数赋值给id和type
      this.id = this.$route.params.product_id -1
      this.type = this.$route.params.product_type

      //将id和type作为参数进行请求
      getGoodsDetail(this.type,this.id).then(res=> {

        this.detailData = res.data[0].product_detail[0]
      }).catch(() => {
        this.detailData = {}
      })
    }
  }
</script>

<style scoped>

</style>
