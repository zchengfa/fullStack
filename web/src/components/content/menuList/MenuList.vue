<template>
  <div class="menu-list">
    <ul>
      <li v-for="(item, index) in menuList" :key="index" :class="{padding:padding}">
        <a :href="item.location">
          <div><img :src="item.iconImagePath || item.image" alt="itemImage"></div>
          <div>{{item.iconName || item.title}}</div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "MenuList",
    props:{
      menuList:{
        type:Array,
        default() {
          return []
        }
      },
      padding: {
        type:Boolean,
        default() {
          return false;
        }
      }
    }
}
</script>

<style scoped>
.menu-list{
  width: 100%;
  min-height: 10rem;
}
  ul{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
    font-size: .8rem;
  }
  ul li{
    margin-top: .8rem;
    width: 25%;
  }
  li a{
    display: block;
  }
  img{
    width: 1.5rem;
    height: 1.5rem;
  }
  .padding {
    padding-top: 1rem;
  }
</style>
