<template>
  <div class="category-list-detail">
    <div class="list-item" v-for="(item, index) in categoryListDetail" :key="index">
      <div class="title"><h4>{{item.title}}</h4></div>
      <div class="content" v-for="(items,index) in item.content" :key="index">
        <a :href="items.location">
          <div class="image-box"><img :src="items.image" alt="image" @load="imageLoadOver"></div>
          <p class="detail-title">{{items.title}}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryListDetail",
  props:{
    categoryListDetail:{
      type:Array,
      default() {
        return []
      }
    }
  },
  methods:{
    imageLoadOver(){
      this.$emit('imageLoad')
    }
  }
}
</script>

<style scoped>
.list-item {
  width: 100%;
  text-align: center;
}
.list-item .title{
  text-align: left;
  text-indent: 1rem;
}
.list-item .content {
  display: inline-block;
  width: 30%;
  text-align: center;
  font-size: .8rem;
}
.content a {
  display: block;
  width: 100%;
}
.content img {
  width: 90%;
  background-size: contain;
}
</style>