<template>
	<div class="category">
    <nav-bar class="nav-bar">
      <div class="category-left" slot="left" @click="openCamera"><img src="~assets/image/category/scan.svg" alt="scan_image"></div>
      <div slot="center">
        <div class="search-box">
          <img src="~assets/image/category/search.svg" alt="search_image">
          <input type="text" placeholder="输入想搜索的商品/店铺"/>
          <img src="~assets/image/category/camera.svg" alt="camera_mage">
        </div>
      </div>
      <div  class="category-right" slot="right"><img src="~assets/image/category/message.svg" alt="message_image"></div>
    </nav-bar>
    <div class="main">
      <Scroll ref="scrollOne" class="scroll-list content" :probe-type="3">
        <ul class="category-list-left" v-if="categoryList.length">
          <li class="list-item" v-for="(item,index) in categoryList"
              :key="index">
            <a :class="{active:currentIndex===index}" @click="showListDetail(index)" :href="item.location">{{item}}</a>
          </li>
        </ul>
      </Scroll>
      <Scroll ref="scrollTwo" class="scroll-list-detail content" :probe-type="3" v-if="categoryListDetail.length">
        <category-list-detail v-show="!isEmpty" :category-list-detail="categoryListDetail" @imageLoad="imageLoadOver" ></category-list-detail>
        <div class="empty" v-show="isEmpty">{{emptyMessage}}</div>
      </Scroll>
      <NoneData class="none-com"></NoneData>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
import CategoryListDetail from "./components/CategoryListDetail";

import {getCategoryList,getCategoryDetail} from "@/network/category";

import {debounce} from "@/common/utils";
import NoneData from "../../components/content/NoneData/NoneData.vue";

export default {
  name:"Category",
  data(){
    return {
      categoryList:[],
      categoryListDetail:[],
      currentIndex:0,
      isEmpty:false,
      emptyMessage:"emptyMessage"
    }
  },
  components:{
    NoneData,
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
        if (res.data.categoryDetail) {
          this.isEmpty = false
          //将获取到的列表详细数据赋给categoryListDetail
          this.categoryListDetail = res.data.categoryDetail
        }
        else {
          this.isEmpty = true
          this.emptyMessage = res.data.empty
        }
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

      //每次点击列表项时让scroll滚动到顶部
      this.$refs.scrollTwo.scrollTo(0,0,0)

    },
    //图片加载完刷新一下scroll
    imageLoadOver() {
      const refresh = debounce(this.$refs.scrollTwo.refresh, 200)
      //使用scroll中的refresh
      refresh()
    },
    //点击打开手机摄像头
    openCamera() {
      //默认需在https环境下才能开启
      let media = navigator.mediaDevices.getUserMedia({video:true})
      media.then(mediaStream => {
        console.log(mediaStream)
      })

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
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.nav-bar{
  background-color: #e5dede;
}
.category-left,.category-right{
  width: 3rem;
}
.nav-bar div{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.search-box{
  position: relative;
  width: 100%;
  height: 100%;
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
  width: 15rem;
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
  color: #8a8686;
}
.scroll-list-detail{
  flex: 3;
}
.empty {
  position: relative;
  top: 50vh;
  left: 50%;
  width: 50%;
  height: 5vh;
  line-height: 5vh;
  color: #a5a2a2;
  border: 1px solid #a5a2a2;
  border-radius: 1rem;
  transform: translate(-50%,-20vh);
}
</style>
