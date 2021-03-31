<template>
  <div class="detail">
    <detail-nav-bar :nav-list="['商品','参数','评论','推荐']"></detail-nav-bar>
    {{id}}
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/DetailNavBar";
  export default {
    name: "detail",
    data(){
      return {
        id:null
      }
    },
    components:{
      DetailNavBar
    },
    created() {
      this.id = this.$route.params.product_id
    }
  }
</script>

<style scoped>

</style>
