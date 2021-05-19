<template>
  <div class="category-list-detail">
    <div class="list-item" v-for="(item, index) in categoryListDetail" :key="index">
      <div class="title"><h4>{{item.title}}</h4></div>
      <div class="content" v-for="(items,index) in item.content" :key="index">
        <div class="image-box"><img :src="items.image" alt="image"></div>
        <p class="detail-title">{{items.title}}</p>
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
  }
}
</script>

<style scoped>

</style>