<template>
  <div class="detail" >
    <detail-nav-bar :nav-list="nav_list" @scrollThere="scrollThere" ref="detailNav"></detail-nav-bar>
    <Scroll class="content" @click.native="closeAddCart" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <div class="shop-show" v-if="Object.keys(detailData).length" >
        <detail-base ref="base" class="detail-base" :base-data="detailData.baseData"></detail-base>
        <product-size :size-name="sizeName" :index="choseSizeObj.index" :item-size="choseSizeObj.item" :key="productSizeKey"></product-size>
        <detail-params  @refresh="refreshScroll" ref="params" :params="detailData.shop_detail_params"></detail-params>
        <detail-comment ref="comment" :comment-num="Number(comment_num)"></detail-comment>
        <detail-image ref="image" :images-data="detailData.images" @imageLoadOver="imageLoad"></detail-image>
        <Recommend ref="recommend" :recommend-data="detailData['recommend_data']" :current-type="sellType" recommend-title="商品推荐"></Recommend>
      </div>
    </Scroll>
    <back-top v-show="isShowBackTop" @click.native="backTop"></back-top>
    <detail-add-cart :product-info="productInfo" v-if="isShowAddCart" @submitAdd="submitAdd" :chose-size-obj="choseSizeObj" :size-name="sizeName"></detail-add-cart>
    <detail-bottom-bar ref="detailBottomBar" @addCart="addCart" :is-collected="isCollected"
                       @collectProduct="collectProduct"
                        @contactCustomer="contactCustomer">
    </detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/component/navBar/DetailNavBar";
  import DetailBase from "@/views/detail/component/content/DetailBase";
  import DetailParams from "@/views/detail/component/content/DetailParams";
  import DetailComment from "@/views/detail/component/content/DetailComment";
  import DetailImage from "@/views/detail/component/content/DetailImage";
  import DetailBottomBar from "@/views/detail/component/bottom/DetailBottomBar";
  import DetailAddCart from "@/views/detail/component/bottom/DetailAddCart";

  import Recommend from "@/components/content/recommend/Recommend";
  import BackTop from "@/components/content/backTop/BackTop";
  import Scroll from "@/components/common/scroll/Scroll";

  import {getGoodsDetail,addShopToCart,getProductCollectionStatus,changeUserProductCollectionStatus} from "@/network/home"
  import {debounce} from "@/common/utils"

  import mixins from "@/common/mixins/mixins";
  import ProductSize from "./component/content/ProductSize";
  import {getUserChoseSize} from "@/network/home";

  export default {
    name: "detail",
    mixins:[mixins.backTopMixins,mixins.contactCustomerMixins],
    data(){
      return {
        id:null,
        type:null,
        sellType:null,
        detailData: {},
        comment_num:0,
        contentTopYs:null,
        scrollToTopY:[],
        currentRefsIndex:0,
        isShowAddCart:false,
        productInfo:{},
        isCollected:false,
        token:this.$store.state.token,
        choseSizeObj:{
          item:null,
          index:null
        },
        productSizeKey:0,
        productDetailIndex:null,
        customer:null,
        size_type:null
      }
    },
    components:{
      DetailNavBar,
      DetailBase,
      DetailParams,
      DetailComment,
      DetailImage,
      Recommend,
      BackTop,
      DetailBottomBar,
      DetailAddCart,
      Scroll,
      ProductSize
    },
    computed:{
      nav_list(){
        //当评论数量大于99的时候让评论数量为99+，反之则为原评论数
        if (this.comment_num>99) return ["商品","参数",`评论(99+)`,"推荐"]
        return ["商品","参数",`评论(${this.comment_num})`,"推荐"]
      },
      sizeName(){

        if (this.size_type===0){
          return 'clothes'
        }
        else if(this.size_type===1){
          return 'pants'
        }
        else if(this.size_type===2){
          return 'shoes'
        }
        else if(this.size_type===3){
          return 'fluid'
        }
        else if(this.size_type===4){
          return 'little'
        }
        else {
          return undefined
        }
      }
    },
    watch:{
      $route(to,from){
        if (to.path !== from.path){
          this.initData()
          if (this.token){
            let userInfo = this.$store.state.userInfo
            this.getProductCollectionStatus(userInfo.user_id,this.id)
          }
        }
      }
    },
    methods:{
      imageLoad(){
        //防抖函数处理scroll组件的刷新
        const refresh = debounce(this.$refs.scroll.refresh, 300)
        //每次加载完图片都让scroll组件进行刷新
        refresh()
        //每次图片加载完就获取各元素位置
        this.contentTopYs()
      },
      contentScroll(position) {
        //根据position位置来控制backTop组件的显示或隐藏(position时负数，需先转成正数再做比较)
        this.isShowBackTop = (- position.y)>1000

        //判断页面滚动的位置来决定navbar中title颜色
        let positionY = - position.y
        let length = this.scrollToTopY.length
        for (let i = 0; i<this.scrollToTopY.length; i++){
          if (this.currentRefsIndex !==i && (i < length -1 && positionY >= this.scrollToTopY[i])||(i === length -1 && positionY >= this.scrollToTopY[i])){
            this.currentRefsIndex = i
            //将i值赋给navbar中的currentIndex
            this.$refs.detailNav.currentIndex = this.currentRefsIndex
          }
        }
      },
      scrollThere(index){
        //根据点击的选项来滚动到相应选项的位置
        this.$refs.scroll.scrollTo(0,-this.scrollToTopY[index],300)
      },
      addCart(){
        //点击加入购物车按钮，先通过查看token是否存在来判定用户是否已经登录，未登录则引导用户进入登录页面，若已登录，则进入下一步操作
        if (this.token) {
          //token存在，点击加入购物车按钮，显示确认加入购物车组件，并将要加入购物车的商品信息添加到productInfo对象中
          this.isShowAddCart = !this.isShowAddCart
          this.productInfo.title = this.detailData.baseData['product_title']
          this.productInfo.image = this.detailData.baseData['product_image']
          this.productInfo.price = this.detailData.baseData.price
        }
        //token不存在，用户未登录，引导用户进入登录页面
        else {
          this.$router.push({path:'/login'})
        }
      },
      //点击addCart组件外部，隐藏addCart组件
      closeAddCart(){
        this.isShowAddCart = false

        //当用户关闭添加商品到购物车组件时改变详情页中DetailBase组件绑定的key值，当key值改变，Vue就会重新渲染该组件，从而达到刷新组件值的目的
        this.productSizeKey +=1
      },
      changeUserProductCollectionStatus(user_id,product_id,status) {
        changeUserProductCollectionStatus(user_id,product_id,status).then(res => {
          if (res.data.current_status) {
            this.isCollected = res.data.current_status
            this.$toast.showToast('商品收藏成功')
          }
          else {
            this.isCollected = res.data.current_status
            this.$toast.showToast('取消收藏')
          }
        })
      },
      collectProduct() {
        //点击按钮先判断用户是否登录，若用户未登录，跳转到登录页面
        if (this.token) {
          let userInfo = this.$store.state.userInfo
          //判断当前商品是在收藏状态还是未收藏状态
          if (this.isCollected) {
            //已处于收藏状态，点击按钮取消收藏
            this.changeUserProductCollectionStatus(userInfo.user_id,this.id,1)
          }
          else {
            //处于未收藏状态，点击按钮收藏商品
            this.changeUserProductCollectionStatus(userInfo.user_id,this.id,0)
          }

        }
        //没有token值，用户未登录，引导用户进入登录页面
        else {
          this.$router.push({path:'/login'})
        }
      },
      submitAdd(e) {
        if (e.size !==null){
          this.productInfo.product_count = e.count
          this.productInfo.size = e.size
          const product = this.productInfo
          if (this.token){
            let userInfo = this.$store.state.userInfo
            addShopToCart(userInfo.user_id,product).then(res => {

              if (res.data.message) {
                //确认加入购物车，隐藏确认加入购物车组件，并将要加入购物车的商品数据提交给后端
                this.isShowAddCart = !this.isShowAddCart

                //点击确定按钮改变productSizeKey值，使detail组件中的ProductSize组件重新渲染，达到更新值的目的
                this.productSizeKey +=1
                this.$toast.showToast(res.data.message)
              }

            }).catch(err => {
              console.log(err)
            })
          }
        }
        else{
          this.$toast.showToast('请选择尺码')
        }
        //使用vuex状态管理来管理购物车数据
        // this.productInfo.shopCount = count
        // this.productInfo.product_id = this.id
        //将产品数据通过vuex的store分发到actions中
        // this.$store.dispatch('addCart',JSON.parse(JSON.stringify(this.productInfo)))
        //     .then(res => {
        //       this.$toast.showToast(res)
        //     })
        //     .catch(err => {
        //       this.$toast.showToast(err)
        //     })
      },
      getProductCollectionStatus(user_id,product_id) {
        getProductCollectionStatus(user_id,product_id).then(res => {
          res.data?this.isCollected = res.data.collection_status:null
        })
      },
      getUserChoseSize(user_id,product_id,index){
        getUserChoseSize(user_id,product_id,index).then(res=>{
          res.data?this.choseSizeObj.item=res.data.size:null
          this.productSizeKey+=1
        }).catch(err=> {
          console.log(err)
        })
      },
      initData(){
        //将路由传过来的参数赋值给id和type
        this.id = this.$route.params.product_id
        this.type = this.$route.params.product_type
        this.sellType = this.$route.params.sell_type
        let pro_id = this.$route.params.id
        let user_id = null
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        userInfo?user_id = userInfo.user_id:null
        //将id和type作为参数进行请求
        getGoodsDetail(this.type,this.sellType,this.id,user_id).then(res=> {
          if (!res.data.err){
            //将请求到的数据赋给detailData
            this.productInfo.product_id = res.data.baseData.product_id
            this.detailData = res.data
            //获取detailData中的评论数据
            this.comment_num = this.detailData.baseData['comment_number']

            //获取商品的尺码规格类型
            this.size_type = this.detailData.baseData['size_type']

            //获取完商品数据后，若用户已登录则获取用户选择该商品的尺寸
            userInfo?this.getUserChoseSize(user_id,this.id,pro_id):null

            //执行获取客服信息函数
            userInfo?this.getCustomerInfo():null

            //dom更新后自动滚动到顶部
            this.$nextTick(()=>{
              this.$refs.scroll?this.$refs.scroll.scrollTo(0,0,300):null
            })
          }

        }).catch((err) => {
          console.log(err)
        })

        //防抖函数处理获取页面元素位置函数
        this.contentTopYs = debounce(()=>{
          this.scrollToTopY = []
          this.scrollToTopY.push(0)
          this.scrollToTopY.push(this.$refs.params.$el.offsetTop)
          this.scrollToTopY.push(this.$refs.comment.$el.offsetTop)
          this.scrollToTopY.push(this.$refs.recommend.$el.offsetTop)
        },100)
      },
      //接收参数组件发出来的刷新scroll组件事件
      refreshScroll(){
        //当参数组件高度变化后，刷新scroll组件
        this.$refs.scroll.refresh()
      },

    },
    created() {
      this.initData()
    },
    mounted() {
     //接收深层组件发出的choseSize事件(来自DetailBase组件中的ProductSize组件)
      this.$bus.$on('choseSize',(e)=>{
        //当用户点击某一尺寸项后，将发出的值跟索引用choseSizeObj来接收
        this.choseSizeObj.item = e.item
        this.choseSizeObj.index = e.index
        //将接收好的值传入detail-bottom-bar组件（在组件中进行传值操作）
      })

      //判断该组件是否创建
      if (this.$refs.detailBottomBar) {
        //创建完页面后检测用户是否登录，若已经登录，获取该用户是否已经收藏过该商品，从而改变收藏按钮的状态，若未登录，让收藏按钮处于默认状态
        if (this.token) {
          let userInfo = this.$store.state.userInfo
          //若用户已经登录
          this.getProductCollectionStatus(userInfo.user_id,this.id)
        }
      }
    }
  }
</script>

<style scoped>
  .detail{
    height: 100vh;
    background-color: #FFF;
  }
  .content{
    position: relative;
    height: calc(100% - 14vh);
    overflow: hidden;
    z-index: 9;
  }
  .detail-base{
    margin-top: 44px;
  }
</style>
