<template>
	<div class="home">
		<nav-bar><div class="nav-title" slot="center">mall首页</div></nav-bar>
    <tab-control v-show="isTabFixed" ref="tabControlOne" class="tab-control" :title="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
    <Scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <swiper :banner="banner" @swiperImageLoad="swiperImageLoad"></swiper>
      <menu-list :menu-list="iconList"></menu-list>
      <tab-control :class="{fixed: isTabFixed}" ref="tabControlTwo" :title="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
      <goods-data :goods="goods[currentType].list" :current-type="currentType"></goods-data>
    </Scroll>
    <back-top v-show="isShowBackTop" @click.native="backTop"></back-top>
	</div>
</template>

<script>
  //引入组件
	import NavBar from '@/components/common/navbar/NavBar.vue'
  import Swiper from '@/components/common/swiper/Swiper.vue'
  import Scroll from "@/components/common/scroll/Scroll"
  import BackTop from "@/components/content/backTop/BackTop"

  import TabControl from '@/components/content/tabControl/TabControl'
  import GoodsData from "@/components/content/goodsData/GoodsData"

  import MenuList from "@/components/content/menuList/MenuList"

  import {backTopMixins} from "@/common/mixins/mixins";
  //引入获取首页数据方法
  import {getHomeMultiData, getGoodsData} from "@/network/home"

  import {debounce} from "@/common/utils";

  export default {
		name:'Home',
    mixins:[backTopMixins],
    data(){
		  return {
		    banner:null,
        iconList:null,
        currentType:'pop',
        goods:{
		      'pop':{page: 0,  list: []},
          'sell':{page: 0, list: []},
          'new':{page: 0, list: []}
        },
        tabOffsetTop:0,
        savePosition:0
      }
    },
		components:{
			NavBar,
      Swiper,
      Scroll,
      BackTop,
      TabControl,
      GoodsData,
      MenuList
		},
    methods:{
      /*
      * 事件监听
      */
      tabClick(index){
        switch (index){
          case(0):
            this.currentType = 'pop'
            break
          case(1):
            this.currentType = 'new'
            break
          case(2):
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControlOne.currentIndex = index
        this.$refs.tabControlTwo.currentIndex = index
      },
      loadMore(){
        //上拉加载更多数据
        this.getGoodsData(this.currentType)
      },
      swiperImageLoad(){
        //当轮播图的图片加载完成时就获取轮播组件距离顶部的高度
       this.tabOffsetTop = this.$refs.tabControlTwo.$el.offsetTop
      },
      /*
      * 请求数据事件
      */
      getHomeMultiData(){
        getHomeMultiData().then(res =>{
          this.banner =res.data[0].multiData[0].banner
          this.iconList = res.data[0].multiData[0].iconList
        })
      },
      getGoodsData(type){
        //每获取一次数据就让当前类型商品的页数加一
        const page = this.goods[type].page +1
        getGoodsData(type, page).then(res => {
         if(res.data.length===0){
           console.log('没有数据！')
         }
         else {
           //将获取到的数据数组通过...语法糖对数组进行解构加入到list数组中
           this.goods[type].list.push(...res.data[0].shopData)
           this.goods[type].page += 1

           //上拉加载一次掉用一次结束上拉
           this.$refs.scroll.finishPullUp()
         }
        })
      }
    },
    created() {
		  this.getHomeMultiData()
      /*
      * 获取首页中（“流行”“新款”“精选”）的数据
      */
      this.getGoodsData("pop")
      this.getGoodsData("new")
      this.getGoodsData("sell")
    },
    mounted() {
		  const refresh = debounce(this.$refs.scroll.refresh, 200)
      //监听图片加载完成
      this.$bus.$on('itemImageLoad', ()=>{
        //使用scroll中的refresh
        refresh()

      })
    },
    activated() {
		  this.$nextTick(() => {
        //进入当前页面时，就让页面回复到之前滚动的位置，并且刷新scroll组件
        this.$refs.scroll.scrollTo(0, this.savePosition, 0)
        this.$refs.scroll.refresh()
      })

    },
    deactivated() {
		  this.savePosition = this.$refs.scroll.scroll.y
    }
  }
</script>

<style scoped>
  .home{
    position: relative;
    height: 100vh;
  }
  .nav-bar{
    background-color: #db7093;
  }
	.nav-title{
    color: #fff;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }
  .fixed{
    position: fixed;
    top:44px;
    left: 0;
    right: 0;
  }
  .content{
    position: absolute;
    top:0;
    bottom: 50px;
    width: 100vw;
    overflow: hidden;
  }
</style>
