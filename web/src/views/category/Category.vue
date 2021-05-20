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
          <li class="list-item" v-for="(item,index) in categoryList"
              :key="index">
            <a :class="{active:currentIndex===index}" @click="showListDetail(index)" :href="item.location">{{item}}</a>
          </li>
        </ul>
      </Scroll>
      <Scroll ref="scrollTwo" class="scroll-list-detail content" :probe-type="3">
        <category-list-detail :category-list-detail="categoryListDetail" @imageLoad="imageLoadOver" ></category-list-detail>
      </Scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
import CategoryListDetail from "./components/CategoryListDetail";

import {getCategoryList,getCategoryDetail} from "@/network/category";

import {debounce} from "@/common/utils";

export default {
  name:"Category",
  data(){
    return {
      categoryList:[],
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
    getCategoryList(){
      getCategoryList().then(res => {
        //将获取到的列表数据赋给categoryList
        this.categoryList = res.data.list

        //拿到列表数据后立即获取列表第一项的详细列表数据
        this.getCategoryDetail(this.categoryList[this.currentIndex])

      }).catch(err => {
        console.log(err)
      })
    },
    getCategoryDetail(type) {
      getCategoryDetail(type).then(res => {
        //将获取到的列表详细数据赋给categoryListDetail
        this.categoryListDetail = res.data.categoryDetail
      })
      .catch(err => {
        console.log(err)
      })
    },
    showListDetail(index){
      this.currentIndex = index
      //清空之前列表详细数据
      this.categoryListDetail = []
      //点击列表项，获取对应的详细列表数据
      this.getCategoryDetail(this.categoryList[this.currentIndex])
    },
    //图片加载完刷新一下scroll
    imageLoadOver() {
      const refresh = debounce(this.$refs.scrollTwo.refresh, 200)
      //使用scroll中的refresh
      refresh()
    },
    //点击打开手机摄像头
    openCamera() {


    }
  },
  created() {
    this.getCategoryList()
  },
  mounted() {

    setTimeout(() => {
      this.$refs.scrollOne.refresh()
      this.$refs.scrollTwo.refresh()
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
  height: calc(100% - 94px);
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
  font-size: .9rem;
  font-min-size: 14px;
  color: #8a8686;
}
.scroll-list-detail{
  flex: 3;
}
</style>
