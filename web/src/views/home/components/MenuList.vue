<template>
  <div class="menu-list">
    <ul>
      <li v-for="(item, index) in iconList" :key="index">
        <div><img :src="item.iconImagePath" alt="itemImage"></div>
        <div>{{item.iconName}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "MenuList",
    props:{
      iconList:{
        type:Array,
        default:[]
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
    width: 20%;


  }
  img{
    width: 2rem;
    height: 2rem;
  }

</style>
