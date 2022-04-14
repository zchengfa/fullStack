<template>
  <div class="banner-detail">
    <nav-bar class="nav-bar">
      <div class="back" slot="left" @click="goBack"><img src="~assets/image/detail/back.svg" alt="back_image"></div>
      <div slot="center" class="center-nav">{{$route.query.brand}}专场</div>
      <div slot="right" class="right-nav" @click="backToHome"><img src="~assets/image/home/icon_home.svg" alt="home_image"></div>
    </nav-bar>
    <Scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">

      <div class="brand-special">
        <div class="special-base">
          <img class="base-image" :src="$route.query.banner_image" alt="banner_image">
          <div class="base-info">
            <div class="brand-logo"><img :src="brand_logo" alt="brand_logo"></div>
            <div class="brand-text"><span>{{$route.query.brand}}</span></div>
            <div class="brand-operation">
              <button class="collect"></button>
              <button class="share"></button>
            </div>
          </div>
        </div>
        <div class="special-filter">
          <filter-bar @sort="sort"></filter-bar>
        </div>
        <goods-data :key="goodsKey" :goods="sortGoods" :current-type="currentType"></goods-data>
      </div>
    </Scroll>
    <back-top  v-show="isShowBackTop" @click.native="backTop"></back-top>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import {backPreviousPageMixins,backTopMixins} from '@/common/mixins/mixins'
import Scroll from "@/components/common/scroll/Scroll.vue"
import {getBrandLogo,getProductByID} from "@/network/homeContent";
import FilterBar from "@/components/content/filterBar/FilterBar.vue";
import GoodsData from "@/components/content/goodsData/GoodsData.vue";

import BackTop from "@/components/content/backTop/BackTop.vue";
import {bubbleSort,reverseArray,debounce} from "@/common/utils";

export default {
  name: "BannerDetail",
  mixins:[backPreviousPageMixins,backTopMixins],
  components:{
    NavBar,
    Scroll,
    FilterBar,
    GoodsData,
    BackTop
  },
  data(){
    return {
      brand_logo:'',
      goods:[],
      brand_id:this.$route.query.brand_id,
      currentType:'',
      goodsKey:0,
      sortGoods:[]
    }
  },
  methods:{
    //返回首页
    backToHome(){
      this.$router.push('/home')
    },
    //获取品牌logo
    getBrandLogo(brand_id){
      getBrandLogo(brand_id).then(res=>{
        res.data.brand_logo?this.brand_logo=res.data.brand_logo:''
      })
    },
    //根据品牌id，获取该品牌所有商品数据
    getProductById(brand_id){
      getProductByID(brand_id).then(res=>{
        res.data.goods?this.goods.push(...res.data.goods):null
        res.data.goods?this.sortGoods=res.data.goods:null
        res.data.goods?this.currentType=res.data.goods[0]['sell_type']:null
      })
    },
    initData() {
      this.getBrandLogo(this.brand_id)
      this.getProductById(this.brand_id)
    },
    sort(arg){
      this.dealSortGoods(arg,arg.way)
      if (arg.way==='normal'){
        this.sortGoods = []
        this.sortGoods.push(...this.goods)
      }
      this.goodsKey++
    },
    dealSortGoods(arg,sortArg){
      if (arg.way===sortArg){
        if (arg.up){
          this.sortGoods = bubbleSort(this.sortGoods,sortArg)
        }
        if (arg.down){
          this.sortGoods = bubbleSort(this.sortGoods,sortArg)
          this.sortGoods = reverseArray(this.sortGoods)
        }
      }
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.$bus.$on('itemImageLoad',()=>{
      //防抖函数处理scroll组件的刷新
      this.$refs.scroll?debounce(this.$refs.scroll.refresh)():null
    })
  }
}
</script>

<style scoped>
.banner-detail{
  width: 100vw;
  height: 100vh;
}
.content{
  position: absolute;
  width: 100vw;
  height: calc(100vh - 44px);
  z-index: 13;
  overflow: hidden;
  background-color: #fff;
}
.nav-bar{
  border-bottom: 1px solid #e1dcdc;
}
.nav-bar img{
  margin-top: 25%;
  width: 2rem;
  transform: translateY(-25%);
}
.center-nav{
  font-size: 1.2rem;
}
.special-base{
  position: relative;
  background-color: rgba(141, 134, 134, 0.8);
  color: #fff;
}
.base-image{
  margin-top: 0;
  width: 100%;
  opacity: .7;
}
.base-info{
  position: absolute;
  display: flex;
  top:50%;
  width: 100%;
  height: 50%;
  justify-items: center;
  align-items: center;
  transform: translateY(-50%);

}
.base-info .brand-logo{
  margin-left: 1rem;
  width: 4rem;
  height: 4rem;

}
.base-info .brand-logo img{
  width: 100%;
  height: 100%;
  border-radius: .3rem;
}
.base-info .brand-text{
  width:50% ;
  height: 4rem;
}
.base-info .brand-text span{
  display: inline-block;
  margin-left: 1rem;
  width: 3rem;
  height: 2rem;
  text-align: center;
}
.brand-operation button{
  margin-left: 1rem;
  width: 1.6rem;
  height: 1.6rem;
}
.brand-operation button.collect{
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAz1JREFUaAXtmd2LTVEYh+eMwWTG97dxQSSFQuTCR0Ry4UK5MJIrzQX+ACWXyp3yD6i5cOFiXKHDTJFQylyRMjWEBo1wGB+TjO357fY67bTPWnufs/c5Z7J/9Zx19l7v+673XWt/rDPT0pIrn4F8BvIZyGfgf56BQjXFe543H7/9sAoWwRiMwL1CofCUNpaIswbDPbAc5sAHeAn9xHlPm64YcCsUYQIqaZiOHmiLGp3zrXAMnkEl/aHjLuyKihE+F2sFCDQVp0twMnAep70DgzAKM2E1HIClIGklDjGTw/4RH8TpoumDbcE5zXgRhqAEC2Ej7IUOkK5AD3F++kdJPxh0Bmg2pB9wHmZHxeF8AQ7Dc5A+gj+LtJvgLUiv4Di0VojTQd9Z+ArSY5gbZes8h+NVRUBvYLPTAQPslEAfSN/gFHzSAeqHWMlgtxaGQLoNU+KMX7bB4YQ80WfQDRdb2OtavwxhXeNAl2NsYd8F74IgZ5I4tuOkWZeOxHYMGeKnIs7BI7gAiZI3ofDbB5JWUU8rtzDslgcahFg3uztq9RbkoEtPOh2OEnkTBQYHg7aXJ4AXdmrQ995/8rKnQaXmSbLOblmfXvJZoulHevS6heEX39zzZrmts7cgFz2if4FecuV7yXYJmTfp7+zTc48QXMYTWOp+LD9ObQWYvcgyd/jsLZj1eYzSDiWK0U7Al60AsynbaYwb3Jo8TF7OAm4ECXc3OHEz/NHgy3VzwtpqyaAEkqne6pNVJ+NvAO2Ax0Fb73jCWG9R6QXoN0Ddxbid8ASki4kSwGE6PJQnegCdiQKkYMyYW+A7qIjk4+OkF4i2v9J9SB7EUgjxbgqLiXa3O2ClzcbaJ2fIpAji+rImkEYno2RSRJB/ffZaWRRR1wK0krUWgf+ASdrSDsS9amxv4sgYvMb1Z4/d8Bq2Q5FEUr2xiZm9SDqVe8KsQvYZR4yQRhENLUA11VpEwwuotQgKcL7IIhY//VO1rkT6GVUR0VUE/dpb6UdJ86pSEUHyulxuTcYiFpC0kpdGYUXzLkGQGUmG3xNjyhwp+fVNn7xJkGRVhP5fII3A5Ek+VEQbiS+GaeZc3uYzkM9APgPlGfgLJ3fW19ra3GsAAAAASUVORK5CYII=);
  background-size: cover;
}
.brand-operation button.share{

  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAm9JREFUWAntmL9rFEEUx+80gpAiNhYqEiSFjaSzEU4RRPz1N9jbSAohoqCN2IqC2Ka0VIOF2CixEdIFO20ENQEbxR8Y1PXz3bzZvb3Z2dvbG1eLG/hkZt57+77v3u7eZq/TaWkkSbIDnsBt2NmSbFiGInbBJ9BYhdlwdEseipiH16DxEU5WShPQg0fwHkYdLzlgW6UATmLUqWVL/ov5KnS948zx2wKbTLUKkrAKgGuggjQewkxWFJujoGJ+wCLsyZyRFuScgtNwE56BzoL0hMbTTIqNTpPGYmaMtCDnDFyGt1A23phxOZPE4K6ZqJ0h71l4Z4KaXsENOAN7YT98AY3D/QWllsww5oJkukbupEm3/qwwnRhMi+2WxTwo+MyYFIwNN+TaDkuW8xvzRfDuImz74Dvo2p0vyGFIR8HYcEMi96k/sz4WSoPvXiqaJPe9GHOM3SHynLNcunOOeEJmwHcANuEnHPTiMKbDc4xgIME0bGxlShaqDiXmusUtlcaZc6wOkeOS5XlRKtJnJO4Q3IXdfeZ8aYkaF8TxepKvW57q51MuG15FKOi45VgLq9TzDH0Y1kvTOWVxj2vGB8NiFeTuqPx5FJTMHXT1gsgttopwytz/OHNe8goDurr1N72QCAW559G0l7zCUKY7VRE/ius5wUm32/06ykHB2LJKg8ERHWW6sS7qaGVOChrWykmHJh0a1oFh/v/2GvqgyvmiivoaVNWNPq1U28W6Dq2a4bxztDA7LaedS1JtD/Se/ddepZ2aOgN6XZeWNHvOV5hx6FcIBbQ1pHWlUMTghoAeNP05pu4H0Wu7NMo7M1jUv97/AXM25V6LWeJqAAAAAElFTkSuQmCC);
  background-size: cover;
}
.special-filter{
  position: relative;
  padding-top: 1.5rem;
  margin-top: -1.5rem;
  background-color: #fff;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
</style>