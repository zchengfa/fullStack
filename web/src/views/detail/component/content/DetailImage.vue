<template>
  <div class="image-detail">
    <div class="image-detail-title"><h4>图文详情</h4></div>
    <div class="image-detail-box" v-for="(item, index) in imagesData" :key="index">
      <img :src="item.imagePath" alt="image_detail" @load="loadOver">
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailImage",
  props:{
    imagesData:{
      type:Array,
      default(){
        return []
      }
    }
  },
  methods:{
    loadOver(){
      this.$emit('imageLoadOver')
    }
  }
}
</script>

<style scoped>
.image-detail{
  margin: 1rem auto 4rem;
  width: 96%;
  border-top: .1rem solid #e3dede;
  border-bottom: .1rem solid #e3dede;
  overflow: hidden;
}
.image-detail-title h4{
  text-indent: 1rem;
}
.image-detail-box img{
  width: 100%;
  background-size: contain;
}
</style>