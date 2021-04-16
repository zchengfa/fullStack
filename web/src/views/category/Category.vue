<template>
	<div class="category">
    <nav-bar class="nav-bar">
      <div slot="left"><img src="~assets/image/category/scan.svg" alt="scan_image"></div>
      <div slot="center">
        <div class="search-box">
          <img src="~assets/image/category/search.svg" alt="search_image">
          <input type="text" placeholder="输入想搜索的商品/店铺"/>
          <img src="~assets/image/category/camera.svg" alt="camera_mage">
        </div>
      </div>
      <div slot="right"><img src="~assets/image/category/message.svg" alt="message_image"></div>
    </nav-bar>
    <div class="main">
      <Scroll ref="scrollOne" class="scroll-list" :probe-type="3">
        <ul>
          <li v-for="(item,index) in shopList" :key="index"><a href="javascript:void (0)">{{item}}</a></li>
        </ul>
      </Scroll>
      <Scroll ref="scrollTwo" class="scroll-list-detail" :probe-type="3">{{shopListDetail}}</Scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
export default {
  name:"Category",
  data(){
    return {
      shopList:[],
      shopListDetail:[]
    }
  },
  components:{
    NavBar,
    Scroll
  }
}
</script>

<style scoped>
.nav-bar{
  text-align: center;
  background-color: #e5dede;
}
.nav-bar div{
  height: 100%;
}
img{
  position: relative;
  top:50%;
  transform: translateY(-50%);
  z-index: 2;
}
.search-box{
  position: relative;
}
.search-box img:first-child{
  position: absolute;
  left: .5rem;
}
.search-box img:last-child{
  position: absolute;
  right: 1rem;
}
.search-box input{
  width:96%;
  height: 70%;
  border-radius: 1rem;
  text-indent: 2rem;
  font-size: .8rem;
}
</style>
