<template>
	<div class="home">
		<nav-bar ref="nav" class="nav">
			<div class="nav-left" slot="left">
        <span class="lightning-word">mall</span>
      </div>
      <div class="nav-title" slot="center">
        <div class="title-box">
          <button @click="toIndexPage" :class="{'active':isIndex}">首页</button>
          <button @click="toNearbyPage" :class="{'active':!isIndex}">附近</button>
        </div>
      </div>
			<div class="nav-right" slot="right">
				<div class="message" @click="contactCustomer"><img :src="message_icon" alt="message_icon"></div>
				<div class="calendar"><img :src="calendar_icon" alt="calendar_icon"></div>
			</div>
      <div slot="bottom">
        <Search class="search" ref="search"></Search>
      </div>
    </nav-bar>
    <div v-show="isIndex" class="index-content">
      <tab-control v-show="isTabFixed" ref="tabControlOne" class="tab-control" :title="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
      <Scroll class="content" ref="scroll"  :probe-type="3" @scroll="contentScroll"
              :pull-up-load="true" @pullingUp="loadMore">
        <swiper class="swiper" :banner="banner" @swiperImageLoad="swiperImageLoad"></swiper>
        <menu-list v-if="hasMenuData"></menu-list>
        <div class="flash-sale" :key="saleKey">
          <div class="sale-top">
            <div class="title">
              <span class="sale-title">mall秒杀</span>
              <span class="begin-sale-hour">{{flashSaleHour}}点场</span>
            </div>
            <div class="rest-sale-time" v-if="time.length">
              <span class="sale-time-item" v-for="(item,index) in time" :key="index">{{item}}</span>
            </div>
            <div class="zero-sale-time" v-else>
              <span class="sale-time-item">00:00:00</span>
            </div>
            <div class="more-sale"><button @click="toMoreSale(flashSaleData[0]['product_id'])">更多秒杀></button></div>
          </div>
          <div class="sale-list" ref="sale">
            <ul ref="saleUl">
              <li ref="saleLi" class="sale-list-item" v-for="(item,index) in flashSaleData" :key="index" @touchStart="toMoreSale">
                <button @click="toMoreSale(item.product_id)" class="sale-image"></button>
                <img  :src="item['product_image']" alt="sale_image">
                <span class="sale-price">{{'￥'+ item['price']}}</span>
              </li>
            </ul>
          </div>
        </div>
        <tab-control class="tab-control" :class="{fixed: isTabFixed}" ref="tabControlTwo" :title="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
        <goods-data :goods="goods[currentType].list"></goods-data>
        <div class="no-more" v-show="noMore"><p>没有更多了哦!</p></div>
      </Scroll>
    </div>
    <div v-show="!isIndex" class="nearby-content">附近相关的</div>
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

  import {backTopMixins,refreshScrollMixins,contactCustomerMixins} from "@/common/mixins/mixins";
  //引入获取首页数据方法
  import {getHomeMultiData, getGoodsData,getFlashSaleData} from "@/network/home"
	import base64 from '@/assets/image/base64/base64'
  
  export default {
    name:'Home',
    mixins:[backTopMixins,refreshScrollMixins,contactCustomerMixins],
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
				isUp:true,
				navHeightDefault:0,
				searchWidthDefault:0,
				searchOffsetTop:0,
				message_icon:null,
				calendar_icon:null,
        lightning_icon:null,
        time:[],
        timer:null,
        isIndex:true,
        isBeginFlashSale:false,
        isFinishFlashSale:false,
        flashSaleHour:null,
        flashSaleData:[],
        saleKey:0
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
		watch:{
			scrollHeight(new_height,old_height){
				//监听滚动的高度，判断前一次与这一次的滚动高度差是否为正数，若为正，则页面是向下滚动，反之则是向上滚动
				//高度差为正，页面向下滚动
				if(new_height-old_height > 0){
					this.isUp = true
				}
				//高度差为负，页面向上滚动
				else{
					this.isUp = false
				}
			}
		},
    methods:{
      /*
       * 事件监听
       */
      //点击导航栏中间的按钮切换对应的内容进行显示
      toIndexPage(){
        this.isIndex = true
      },
      //点击导航栏中间的按钮切换对应的内容进行显示
      toNearbyPage(){
        this.isIndex = false
      },
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
      getFlSaleData(flashSaleHour){
        getFlashSaleData(flashSaleHour).then(res=>{
          this.flashSaleData.push(...res.data)

          //拿到数据后重新设置ul元素的宽度
          //this.flashSaleData.length?this.$refs.saleUl.style.width = this.flashSaleData.length * 4 *19 +'px':null
        })
      },
      toMoreSale(product_id){
        console.log(product_id)
        this.$router.push('/flashSale/'+product_id)
        // this.$toast.showToast('更多秒杀数据暂无，请等待后续完善')
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

        this.scrollHeight = this.$store.state.position.y
				
				let searchEl = document.getElementsByClassName('search').item(0)
				let navEl = document.getElementsByClassName('nav').item(0)
        let titleBoxEl = document.getElementsByClassName('title-box').item(0)
        //当前搜索部分的宽度
				let searchClWidth = this.$refs.search.$el.clientWidth

        //当前搜索部分的高度
				let searchClHeight = this.$refs.search.$el.clientHeight

        //当前导航栏的高度
				let navClHeight = this.$refs.nav.$el.clientHeight

        //搜索部分的最小宽度
        let searchMinWidth = 240
				
				//滚动的Y值小于0，页面一直页面初始位置的上方滚动
				if(this.scrollHeight < 0) {
					
					//通过监听this,scrollHeight的值得到当前用户在做向下滚动
					if(this.isUp){
						
						//且滚动距离小于导航栏高度
						if(this.scrollHeight > - this.navHeightDefault){
							
							//导航栏当前高度小于初始状态下的高度时，将导航栏高度变大，输入框部分宽度保持最小值状态,导航栏按钮透明度变大
							if(navClHeight < this.navHeightDefault){
                this.changeElStyle(navEl,searchEl,navClHeight + 1,navClHeight - (searchClHeight+6),searchMinWidth)
                titleBoxEl.style.opacity =  navClHeight/this.navHeightDefault
							}
							
							//导航栏当前高度等于初始状态下的高度时，保持高度为初始状态高度，输入框部分宽度变大
							else{
								navEl.style.height = this.navHeightDefault +'px'
								searchEl.style.width = (searchClWidth + searchClWidth/10) + 'px'
							}
							
						}
						//滚动距离大于导航栏高度时，将导航栏高度保持为特定高度，并且输入框部分距离顶部3px，position:absolute ，水平垂直居中
						else{
              this.changeElStyle(navEl,searchEl,this.searchOffsetTop,3,searchMinWidth)
              titleBoxEl.style.opacity = 1
						}
					}
					//通过监听this,scrollHeight的值得到当前用户在做向上滚动
					else{
						//用户向上滚动，缩短输入框部分的宽度
						searchEl.style.width = (searchClWidth - searchClWidth/20) +'px'
						
						//当输入框部分缩短到最小值时，保持宽度不变，缩小导航栏高度，输入框部分水平垂直居中，,导航栏按钮透明度变小
						if(searchClWidth ===searchMinWidth){
							if(navClHeight > 48){
                this.changeElStyle(navEl,searchEl,navClHeight -1,navClHeight - (searchClHeight+6),searchMinWidth)
                titleBoxEl.style.opacity =  navClHeight/searchClWidth
							}
						}
					}
				}
				//滚动的Y值大于0，用户在做下拉操作，需将导航栏上的元素保持与初始状态一致
				else{
          this.changeElStyle(navEl,searchEl,this.navHeightDefault,this.searchOffsetTop,this.searchWidthDefault)
          titleBoxEl.style.opacity = 1
				}	
      },
      //改变导航栏与搜索部分元素的样式
      changeElStyle(navEl,searchEl,navHeight,searchTop,searchWidth){
        navEl.style.height = navHeight + 'px'
        searchEl.style.position = 'absolute'
        searchEl.style.top = searchTop+'px'
        searchEl.style.left = '50%'
        searchEl.style.width = searchWidth + 'px'
        searchEl.style.transform = "translateX(-50%)"
      },
			restFlashSale(){
				//持续两小时
				let wholeFlashSaleHours = 2
				
				//获取当前时间的小时
				let nowHours = new Date().getHours()
				
				//当小时为0时，将他赋值为24点
				nowHours===0?nowHours = 24 :null
				
				//当小时为偶数时，将其作为秒杀开场点
				nowHours%2===0?this.flashSaleHour = nowHours:this.flashSaleHour = nowHours - 1
				
				let finishSaleHour = this.flashSaleHour + wholeFlashSaleHours
				
				if(nowHours - this.flashSaleHour <= wholeFlashSaleHours){
					this.timer = setInterval(() => {
             nowHours = new Date().getHours()
            let nowMinute = new Date().getMinutes()
            let nowSeconds = new Date().getSeconds()
            let hadHours = dealHadTime(finishSaleHour - nowHours - 1)
            let hadMinutes = dealHadTime(60 - nowMinute - 1)
            let hadSeconds = dealHadTime(60 - nowSeconds - 1)
            this.time = (hadHours + ':' + hadMinutes + ':' + hadSeconds).split('')

            if(hadHours==='00' && hadMinutes==='00' && hadSeconds==='00'){
              clearInterval(this.timer)
              nowHours = new Date().getHours()
              this.flashSaleHour = new Date().getHours()
              this.flashSaleData = []
              this.getFlSaleData(this.flashSaleHour)
              this.restFlashSale(this.flashSaleHour)
              this.$nextTick(()=>{
                this.saleKey++
              })
            }
					}, 1000)
				}
				//时间小于10的添个0
        function dealHadTime(time) {
          if (time < 10) {
            if (time >=0){
              return '0' + time
            }
            else{
              return '01'.toString()
            }
          } else {
            return time.toString()
          }
        }
			}
    },
    created() {
      this.getHomeMultiData()
			this.message_icon = base64['message']
			this.calendar_icon = base64['calendar']
      this.lightning_icon = base64['lightning']
			
			//给定偶数的时间点为秒杀开始的时间点,秒杀持续时间为两小时
			this.restFlashSale()
      this.flashSaleHour?this.getFlSaleData(this.flashSaleHour):null
    },
		mounted() {
			this.navHeightDefault = this.$refs.nav.$el.clientHeight
			this.searchWidthDefault = this.$refs.search.$el.clientWidth
			this.searchOffsetTop = this.$refs.search.$el.offsetTop

      //解决better-scroll中嵌套原生滚动组件时，原生组件无法滚动的问题（办法：在原生组件中添加触摸事件，阻止触摸事件的冒泡）
      this.$refs.saleUl.addEventListener('touchstart',(e)=>{
        e.stopPropagation()
      });
		},
    activated() {
      this.refreshGoodsData()
    }
  }
</script>

<style scoped>
  .nav-title .active{
    background-color: #fff;
    color: #fd001e;
  }
  .home{
    position: relative;
    height: 100vh;
  }
  .nav-bar{
    background-color: #e92e2e;
  }
	.nav-left{
		width: 60px;
	}
	.nav-title button{
    width: 4.6rem;
    height: 1.6rem;
    color: #fff;
    border-radius: 1rem;
  }
  .nav-title .title-box{
    margin: 10px auto;
    width: 9.2rem;
    border-radius: 2rem;
    height: 1.6rem;
    line-height: 1.6rem;
    background-color: rgba(42, 41, 41, 0.21);
  }
	.nav-right{
		position: relative;
		right: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 44px;
	}
	.nav-right div{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 44px;
	}
  .lightning-word{
    display: inline-block;
    color: #fff;
    font-family: "Rage Italic",serif;
    animation: lightning 1s alternate infinite;
    transform: skew(-20deg);
  }
  .lightning-box img{
    width: 1.4rem;
  }
  /*秒杀样式*/
  .flash-sale{
    margin: 1rem auto;
    padding: .5rem 0;
    width: 94%;
    border-radius: .5rem;
    background-color: #e6e1e8;
    overflow: hidden;
  }
  .sale-top{
    overflow: hidden;
  }
  .sale-top div{
    float: left;
    margin-left: 1rem;
  }
  .sale-top .title .sale-title{
    font-weight: bold;
  }
  .sale-top .title .begin-sale-hour{
    margin-left: .5rem;
    font-weight: bold;
    font-size: .8rem;
    color: #fd001e;
  }
  .sale-time-item{
    display: inline-block;
    padding: 2px 0;
    background-color: #fd2e00;
    color: #fff;
    font-size: .8rem;
  }
  .sale-time-item:nth-child(3),
  .sale-time-item:nth-child(6){
    padding: 2px 2px;
    background-color: #FFF;
    color: #fd001e;
    font-weight: bold;
  }
  .sale-time-item:first-child,
  .sale-time-item:nth-child(4),
  .sale-time-item:nth-child(7){
    border-top-left-radius: .2rem;
    border-bottom-left-radius: .2rem;
  }
  .sale-time-item:last-child,
  .sale-time-item:nth-child(2),
  .sale-time-item:nth-child(5){
    border-top-right-radius: .2rem;
    border-bottom-right-radius: .2rem;
  }
  .sale-top .more-sale{
    margin-right: .5rem;
    float: right;
  }
  .sale-top .more-sale button{
    color: #fd001e;
    font-size: .9rem;
  }
  .sale-list{
    position: relative;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
  .sale-list ul{
    margin: .5rem auto 0;
    width: 100%;
    float: left;
  }
  .sale-list ul li{
    margin-left: .5rem;
    margin-right: .5rem;
    display: inline-block;
  }
  .sale-image{
    position: absolute;
    top: 0;
    width: 4rem;
    height: 6rem;
    display: block;
    background-color: transparent;
  }
  .sale-list-item img{
    width: 4rem;
  }
  .sale-list::-webkit-scrollbar{
    opacity: 0;
  }
  .sale-list-item span{
    display: block;
    color: #fd001e;
    font-size: .9rem;
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
@-webkit-keyframes lightning {
  from {
    text-shadow: 0 0 10px lightblue, 0 0 20px lightblue, 0 0 30px lightblue, 0 0 40px skyblue, 0 0 50px skyblue, 0 0 60px skyblue;
    color: #2294dc;
  }

  to {
    text-shadow: 0 0 5px lightblue, 0 0 10px lightblue, 0 0 15px lightblue, 0 0 20px skyblue, 0 0 25px skyblue, 0 0 30px skyblue;
    color: #fff;
  }
}
</style>
