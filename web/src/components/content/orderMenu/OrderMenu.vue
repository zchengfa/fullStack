<template>
  <div class="menu">
    <div class="menu-item" v-for="(item, index) in orderList" :key="index">
      <a :href="item.location" class="item-link">
        <div class="item-content">
          <img :src="item.image" alt="item_image">
          <p>{{item.title}}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderMenu",
  props:{
    orderList:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
 .menu {
   display: flex;
   padding: 1rem 0;
   margin-top: 1rem;
   margin-left: auto;
   margin-right: auto;
   width: 96vw;
   font-size: .8rem;
   text-align: center;
   border-radius: .5rem;
 }
 .menu .menu-item {
   flex: 1;
 }
 .menu-item img {
   position: relative;
   top:.5rem;
   min-width: 16px;
   min-height: 16px;
   width: 1.5rem;
   height: 1.5rem;
   background-size: contain;
 }
</style>