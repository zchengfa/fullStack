<template>
  <div class="image">
    <div class="title"><h4>详情介绍</h4></div>
    <div class="image-detail-box" v-for="(item, index) in imagesData" :key="index+item">
      <img :src="item['product_image']" alt="image_detail" @load="loadOver">
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
      //每次图片加载完后就把事件发送给父组件，让父组件对事件作出处理
      this.$emit('imageLoadOver')
    }
  }
}
</script>

<style scoped>
.image{
  margin: 1rem auto 4rem;
  width: 96%;
  border-top: .1rem solid #e3dede;
  border-bottom: .1rem solid #e3dede;
  overflow: hidden;
}
.image-detail-box img{
  width: 100%;
  background-size: contain;
}
</style>