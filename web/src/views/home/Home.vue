<template>
	<div class="home">
		<nav-bar ref="nav" class="nav">
      <div class="nav-title" slot="center"></div>
      <div slot="bottom">
        <Search class="search" ref="search"></Search>
      </div>
    </nav-bar>
    <tab-control v-show="isTabFixed" ref="tabControlOne" class="tab-control" :title="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
    <Scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <swiper class="swiper" :banner="banner" @swiperImageLoad="swiperImageLoad"></swiper>
      <menu-list v-if="hasMenuData"></menu-list>
      <tab-control class="tab-control" :class="{fixed: isTabFixed}" ref="tabControlTwo" :title="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
      <goods-data :goods="goods[currentType].list"></goods-data>
      <div class="no-more" v-show="noMore"><p>没有更多了哦!</p></div>
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
  import Search from '@/components/content/search/Search'

  import MenuList from "@/components/content/menuList/MenuList"

  import {backTopMixins,refreshScrollMixins} from "@/common/mixins/mixins";
  //引入获取首页数据方法
  import {getHomeMultiData, getGoodsData} from "@/network/home"
  
  export default {
    name:'Home',
    mixins:[backTopMixins,refreshScrollMixins],
    data(){
      return {
        banner: [],
        currentType: 'pop',
        goods: {
          'pop': {page: 0, list: []},
          'sell': {page: 0, list: []},
          'new': {page: 0, list: []}
        },
        tabOffsetTop: 0,
        noMore: false,
        userCollections: [],
        hasMenuData: false,
        collectedStateArray: {
          'pop': [],
          'sell': [],
          'new': []
        },
        getDataCount: 0,
        scrollHeight: 0,
        navHeight:0
      }
    },
    components:{
      NavBar,
      Swiper,
      Scroll,
      BackTop,
      TabControl,
      GoodsData,
      MenuList,
      Search
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
          this.banner =res.data
          //let result = res.data[0].multiData[0]['iconList']
          // result ? this.menuList = result : null
          // result ? this.hasMenuData = true : this.hasMenuData = false
        }).catch(err => {
          console.log(err)
        })
      },
      getGoodsData(type){
        let user_id = ''
        const token = this.$store.state.token
        token?user_id=this.$store.state.userInfo.user_id:''

        //每获取一次数据就让当前类型商品的页数加一
        const page = this.goods[type].page +1
        getGoodsData(user_id,type, page).then(res => {
          if(res.data.length===0){
            this.noMore = true
            setTimeout(() => {
              this.noMore = false
            },1000)
          }
          else {
            //将获取到的数据数组通过...语法糖对数组进行解构加入到list数组中
            this.goods[type].list.push(...res.data)
            this.goods[type].page += 1
            this.getDataCount ++

          }
          //上拉加载一次调用一次结束上拉
          this.$refs.scroll.finishPullUp()
        })
      },
      refreshGoodsData(){
        this.goods = {
          'pop':{page: 0,  list: []},
          'sell':{page: 0, list: []},
          'new':{page: 0, list: []}
        }
        /*
         * 获取首页中（“流行”“新款”“精选”）的数据
         */
        this.getGoodsData("pop")
        this.getGoodsData("new")
        this.getGoodsData("sell")
      },
      contentScroll(position){
        //根据position位置来控制backTop组件的显示或隐藏(position时负数，需先转成正数再做比较)
        this.isShowBackTop = (- position.y)>1000

        //根据position的位置控制tabControl是否吸顶
        this.isTabFixed = (- position.y) > (this.tabOffsetTop - 48)

        this.$store.dispatch('savePosition',JSON.parse(JSON.stringify(position))).then()

        this.scrollHeight = -(this.$store.state.position.y)
        this.navHeight = this.$refs.nav.$el.clientHeight

				//获取搜索组件元素
        let searchElement = document.getElementsByClassName('search').item(0)
				//获取导航栏元素
				let navElement = document.getElementsByClassName('nav').item(0)
				
        if (this.scrollHeight>0&&this.scrollHeight<=82){
          searchElement.style.width = (this.$refs.search.$el.clientWidth - this.scrollHeight/5) + 'px'

          if(this.$refs.search.$el.clientWidth===240){
            searchElement.style.position = 'relative'
            searchElement.style.top = (this.$refs.search.$el.clientHeight - this.scrollHeight)+'px'

            if(this.$refs.nav.$el.clientHeight===48){
              navElement.style.height = 48 +'px'
              searchElement.style.position = 'absolute'
              searchElement.style.top = '50%'
              searchElement.style.left = '50%'
              searchElement.style.transform= "translateX("+ '-50%' +")"+ "translateY("+ '-50%' +")"
            }
            else{
              navElement.style.height = ( this.$refs.nav.$el.clientHeight - this.$refs.nav.$el.clientHeight/this.$refs.nav.$el.clientHeight)+'px'
            }
          }
        }
        else{
          navElement.style.height = 48 +'px'
          searchElement.style.position = 'absolute'
          searchElement.style.top = '50%'
          searchElement.style.left = '50%'
          searchElement.style.transform= "translateX("+ '-50%' +")"+ "translateY("+ '-50%' +")"
        }
				// if (this.$refs.search.$el.clientWidth===240&&this.$refs.nav.$el.clientHeight===48){
        //
				//   if (this.scrollHeight>0&&this.scrollHeight<=82){
				//     this.navHeight++
				//     navElement.style.height = this.navHeight+'px'
				//     // navElement.style.height = (this.$refs.nav.$el.clientHeight +10) + 'px'
        //     // searchElement.style.position = 'relative'
        //     // searchElement.style.marginTop = '48px'
        //     // searchElement.style.marginLeft = '50%'
        //     // searchElement.style.transform= "translateX("+ '-50%' +")"+ "translateY("+ '-50%' +")"
        //     console.log(navElement.style.height,this.navHeight)
        //   }
        // }
				// else{
        //
        // }

        //console.log(this.$refs.search.$el.clientWidth,this.$refs.nav.$el.clientHeight)
				//console.log(this.$refs.scroll.$el.clientHeight)
        
      },
    },
    created() {
      this.getHomeMultiData()
    },
    activated() {
      this.refreshGoodsData()
    }
  }
</script>

<style scoped>
  .home{
    position: relative;
    height: 100vh;
  }
  .nav-bar{
    background-color: #e92e2e;
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
    width: 100vw;
    height: calc(100vh - 44px - 4rem);
    overflow: hidden;
  }
  .no-more {
    text-align: center;
    color: #a5a2a2;
    font-size: 12px;
  }

</style>
