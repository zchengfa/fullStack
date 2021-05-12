<template>
  <div class="menu-list">
    <ul>
      <li v-for="(item, index) in menuList" :key="index">
        <a href="javascript:void (0)">
          <div><img :src="item.image_path" alt="itemImage"></div>
          <div>{{item.icon_name}}</div>
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
      }
    }
}
</script>

<style scoped>
  ul{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
    font-size: 14px;
  }
  ul li{
    margin-top: .8rem;
    width: 25vw;
  }
  li a{
    display: block;
  }
  img{
    width: 2rem;
    height: 2rem;
  }

</style>
