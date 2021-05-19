<template>
	<div class="category">
    <nav-bar class="nav-bar">
      <div slot="left" @click="openCamera"><img src="~assets/image/category/scan.svg" alt="scan_image"></div>
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
      <Scroll ref="scrollOne" class="scroll-list content" :probe-type="3">
        <ul class="category-list-left">
          <li class="list-item" v-for="(item,index) in categoryData.list"
              :key="index">
            <a :class="{active:currentIndex===index}" @click="showListDetail(index)" :href="item.location">{{item}}</a>
          </li>
        </ul>
      </Scroll>
      <Scroll ref="scrollTwo" class="scroll-list-detail content" :probe-type="3">
        <category-list-detail :category-list-detail="categoryListDetail"></category-list-detail>
      </Scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
import CategoryListDetail from "./components/CategoryListDetail";

import {getCategoryData} from "@/network/category";

export default {
  name:"Category",
  data(){
    return {
      categoryData:[],
      categoryListDetail:[],
      currentIndex:0
    }
  },
  components:{
    NavBar,
    Scroll,
    CategoryListDetail
  },
  methods:{
    getCategoryData(){
      getCategoryData().then(res => {
        console.log(res.data[0])
        this.categoryData = res.data[0]

        this.categoryListDetail = this.categoryData.categoryData[this.currentIndex][this.categoryData.list[this.currentIndex]]


      }).catch(err => {
        console.log(err)
      })
    },
    showListDetail(index){
      this.currentIndex = index
      this.categoryListDetail = this.categoryData.categoryData[index][this.categoryData.list[index]]
    },
    //点击打开手机摄像头
    openCamera() {


    }
  },
  created() {
    this.getCategoryData()
  },
  mounted() {

    setTimeout(() => {
      this.$refs.scrollOne.scroll.refresh()
    },100)
  },
  activated() {



  }
}
</script>

<style scoped>
.active{
  font-weight: bold;
  background-color: #fff;
  color: #e02929;
  border-left: 2px solid #e02929;
}
.category{
  width: 100vw;
  height: 100vh;
}
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
.main{
  display: flex;
  width: 100%;
  height: 100%;
}
.content{
  display: inline-block;
  flex: 1;
  height: calc(100% - 90px);
  overflow: hidden;
}
.list-item,a{
  width: 100%;
  height: 3rem;
  background-color: #eae3e3;
}
a{
  display: inline-block;
  line-height: 3rem;
  text-align: center;
  font-size: 1rem;
  color: #8a8686;
}
.scroll-list-detail{
  flex: 3;
}
</style>
