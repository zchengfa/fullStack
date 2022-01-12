<template>
	<div class="nav-cart">
    <nav-bar class="cart-nav-bar">
      <div slot="center">
        <div class="nav-title">购物车({{cartList.length}})</div>
      </div>
      <div slot="right" @click="manageOrComplete">
        <button v-show="!isComplete" class="manage">管理</button>
        <button v-show="isComplete" class="complete">完成</button>
      </div>
    </nav-bar>
    <Scroll class="content" :class="{'has-settle-component':cartList.length}" ref="scroll">
      <div class="cart" v-if="cartList.length">
        <div class="cart-item" v-for="(item,index) in cartList" :key="index">
          <div  class="check">
            <check-button :is-checked="Boolean(item.isChecked)" @click.native="changeChecked(index)"></check-button>
          </div>
          <div class="shop-info">
            <div class="image-box"><img :src="item['product_image']" alt="cart_image"></div>
            <div class="info">
              <p class="title">{{item['product_title']}}</p>
              <div class="price-size">
                <div class="price"><span class="discount-character">￥</span><span>{{item['product_price']}}</span></div>
                <div class="size"><span>尺码：</span><span>{{item['size']}}</span><span class="down-character">﹀</span></div>
              </div>
              <count class="count-component" :count="item['quantity']" :index="index"></count>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else-if="!cartList.length && !isLogin" :empty-message="emptyMessage"></Empty>
      <div class="login-tip" v-if="isLogin">
        <span>您还未登录</span>
        <router-link class="to-login" :to="{path:'/login'}">马上登录</router-link>
      </div>
      <Recommend class="recommend" :align-center="true" :recommend-data="recommendData" recommend-title="为你推荐"></Recommend>
    </Scroll>

    <settle-cart :total-price="totalPrice"
                 :settle-num="settleNum"
                 v-show="cartList.length"
                 @selectAll="selectAll"
                 :is-all-checked="isAllChecked"
                 @settle="settle"
                 :show-total-and-settle="showTotalAndSettle"
                 @moveToCollection="moveToCollection"
                 @remove="remove"
    ></settle-cart>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar"
  import Scroll from "@/components/common/scroll/Scroll"
  import Empty from "@/components/common/empty/Empty";
  import Recommend from "@/components/content/recommend/Recommend";

  import {debounce} from "@/common/utils";

  import CheckButton from "@/views/cart/components/CheckButton"
  import SettleCart from "@/views/cart/components/SettleCart";

  import {getCommonRecommend,getUserRecommend,getUserCartData,updateChecked,
    updateProductCount,moveToCollection,remove} from "@/network/cart";
  import Count from "../../components/content/count/Count";

  export  default {
    name:'Cart',
    data(){
      return {
        isComplete:false,
        showTotalAndSettle:true,
        cartList: [],
        user_id:'',
        isLogin:false,
        recommendData:[],
        emptyMessage: '',
        emptyRecommend:'',
        checkedNum:0,
        targets:[]
      }
    },
    components:{
      NavBar,
      Scroll,
      CheckButton,
      SettleCart,
      Empty,
      Recommend,
      Count
    },
    computed:{
      totalPrice () {
        //将计算好的总价格传给子组件
        let price = 0
        this.cartList.map((item) => {
          if (item.isChecked) {
            (price += item['quantity'] * item['product_price']).toFixed(2)
          }
        })
        return Number(price.toFixed(2))
      },
      settleNum () {
        let settleNum = 0
        this.cartList.map((item) => {
          if (item.isChecked) {
            settleNum ++
          }
          this.checkedNum = settleNum
        })

        return settleNum
      },
      isAllChecked () {
         return this.checkedNum === this.cartList.length
      }
    },
    methods:{
      //点击导航栏右边按钮控制按钮的显示与隐藏，并控制结算组件中删除等按钮的显示与隐藏
      manageOrComplete(){
        this.isComplete = !this.isComplete
        //计算组件中删除和移入收藏夹按钮的显示与隐藏
        this.showTotalAndSettle = !this.showTotalAndSettle
      },
      //减少用户所点击的商品数量函数
      reduceCount(index){
        //减少对应商品的数量
        this.cartList[index]['quantity'] --

        //提交减少该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index]['quantity'],this.cartList[index]['size']).then()
        //console.log(index,this.cartList[index])
      },
      //增加用户所点击的商品数量函数
      addCount(index){
         //增加对应商品的数量
         this.cartList[index]['quantity'] ++

        //提交增加该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index]['quantity'],this.cartList[index]['size']).then()

      },
      changeChecked(index){

        //点击选中按钮，修改按钮状态
        this.cartList[index].isChecked = !this.cartList[index].isChecked

        //点击选中按钮时判断是否已选中，若已选中则将该商品的id加入到targets数组中
        if (this.cartList[index].isChecked){
          this.targets.push(this.cartList[index].product_id)
        }
        //取消选中该商品，则将该商品id从targets数组中删除
        else {
          //删除该商品前，需要找到该商品在targets数组中的位置
          this.targets.splice(this.targets.indexOf(this.cartList[index].product_id),1)
        }

        //提交更新请求
        updateChecked(this.user_id, this.cartList[index].product_id, this.cartList[index].isChecked).then()

      },
      //全选与取消全选
      selectAll(){
        //判断当前全选按钮处于什么状态，若是已经是全选状态，则让全选的商品进入未选择状态，若是不处于全选状态，则让未选择的商品进入选中状态
        if (this.checkedNum === this.cartList.length) {
          this.cartList.map((item) => {
            //修改状态
            item.isChecked = false

            //将修改后的状态提交给后端，让后端修改数据库中该用户的状态
            updateChecked(this.user_id,item.product_id,item.isChecked).then()
          })
          //取消全选，清空targets数组
          this.targets = []
        }
        else {
          //全选，先清空targets数组
          this.targets = []
          this.cartList.map((item) => {
            item.isChecked = true

            //将cartList数组中的product_id全部加入targets中
            this.targets.push(item.product_id)
            //将修改后的状态提交给后端，让后端修改数据库中该用户的状态
            updateChecked(this.user_id,item.product_id,item.isChecked).then()
          })
        }
      },
      settle(){
        //点击结算按钮时先判断是否选择了商品
        if (this.checkedNum) {
          this.$toast.showToast('支付系统暂未开发')
        }
        else {
          this.$toast.showToast('您未选中任何要结算的商品')
        }
      },
      //将选择的商品移入收藏夹
      moveToCollection() {
        if(this.targets.length){
          moveToCollection(this.user_id,this.targets).then(res=>{

            if(res.data.success){
              remove(this.user_id,this.targets).then(result => {
                if (result.data.success){
                  //删除成功后再删除cartList中对应的产品数据，并给用户作出删除成功提示
                  this.targets.map(item => {
                    this.cartList.splice(this.cartList.indexOf(item),1)
                    console.log(this.cartList.splice(this.cartList.indexOf(item),1))
                  })
                  //this.cartList对应数据删除后，删除之前用户选择收藏的数据
                  this.targets = []
                  this.getUserCartData(this.user_id)
                  this.$toast.showToast(res.data.success)
                }

              })

            }
          }).catch(err=>{
            console.log(err)
          })
        }
        else{
          this.$toast.showToast('您未选择任何商品！')
        }
      },
      //将商品从用户购物车中移除
      remove() {
        //当用户勾选了商品后才发起请求
        if(this.targets.length){
          remove(this.user_id,this.targets).then(res => {
          if (res.data.success){
            //删除成功后再删除cartList中对应的产品数据，并给用户作出删除成功提示
            this.targets.map(item => {
              this.cartList.splice(this.cartList.indexOf(item),1)
            })
            //this.cartList对应数据删除后，删除之前用户选择删除的数据
            this.targets = []
            this.getUserCartData(this.user_id)
            this.$toast.showToast(res.data.success)
            }
          })
        }
         else{
          this.$toast.showToast('您还没有选择任何商品！')
        }
        
      },
      //获取商品推荐数据函数
      getCommonRecommend(){
        getCommonRecommend().then(res => {
          this.recommendData = res.data.commonRecommend
        }).catch(err => {
          console.log(err)
        })
      },
      getUserRecommend(token){
        getUserRecommend(token).then(res => {
          //console.log(res)
          this.recommendData = res.data.result
        }).catch(err => {
          console.log(err)
        })
      },
      //获取用户购物车数据函数
      getUserCartData (user_id) {
        getUserCartData(user_id).then(res => {
          //清空之前的数据
          this.cartList = []
          //判断是否存在用户购物车数据
          if(res.data.user_cart_data) {
            //获取user_id
            this.user_id = res.data.user_id
            //遍历数组
            this.cartList =  res.data.user_cart_data

            this.checkProductIsCheck()
          }
          else {
            this.emptyMessage = res.data.empty
          }
        })
      },
      checkProductIsCheck(){
        //元素挂载完成后，遍历cartList数组，若是已选中状态则将该商品id加入targets数组中
        
        if (this.cartList.length){
          this.cartList.map(item => {
            if (item.isChecked){
              this.targets.push(item.product_id)
            }
          }) 
         // console.log(this.cartList.length,this.targets)
        }
      }
    },
    mounted() {
     
      //console.log(this.cartList)
      const refresh = debounce(this.$refs.scroll.refresh, 200)
      this.$bus.$on('itemImageLoad',() => {
        refresh()
      })
      if (this.$refs.scroll){
        //进入页面时刷新scroll
        setTimeout(()=>{
          this.$refs.scroll.scroll.refresh()
        },30)
      }
      //判断用户是否登录,若已登录显示用户的购物车物品列表,未登录，显示登录提示
      this.$bus.$on('addCount',(e)=>{
        let index = e.index
        //增加对应商品的数量
        this.cartList[index]['quantity'] ++

        //提交增加该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index]['quantity'],this.cartList[index]['size']).then()

      })
      this.$bus.$on('reduceCount',(e)=>{
        let index = e.index
        //减少对应商品的数量
        this.cartList[index]['quantity'] --

        //提交减少该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index]['quantity'],this.cartList[index]['size']).then()
        //console.log(index,this.cartList[index])
      })
      if (this.$store.state.token){
        let userInfo = this.$store.state.userInfo
        this.isLogin = false

        //存在token值，用户已登录，执行获取用户购物车数据函数
        //进入购物车页面，获取用户token，执行获取用户购物车数据函数
        this.getUserCartData(userInfo.user_id)

        //获取用户对应的推荐数据
        this.getUserRecommend(userInfo.user_id)

      }
      else {
        //token值不存在，用户未登录，获取默认的推荐数据
        this.getCommonRecommend()
        this.isLogin = true
      }
    }
  }
</script>

<style scoped>
  .nav-cart{
    width: 100vw;
    height: 100vh;
  }
  .cart-nav-bar{
    background-color: #db7093;
  }
  .cart-nav-bar .nav-title,
  .cart-nav-bar button{
    color: #fff;
  }
  .content{
    height: calc(100vh - 98px);
    overflow: hidden;
    background-color: rgba(205, 198, 198, 0.2);
  }
  /*用户购物车中有商品时会使计算组件出现，所以需要更少的可是滚动区域*/
  .has-settle-component{
    height: calc(100vh - 98px - 3rem);
  }
  .login-tip{
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
    width: 50%;
    line-height: 1.5rem;
  }
  .login-tip span{
    display: inline-block;
    width: 100%;
    text-align: center;
    color: #a5a2a2;
  }
  .to-login{
    display: block;
    margin: .5rem auto;
    width: 5rem;
    height: 1.5rem;

    background-color: #fff;
    border: 1px solid #a5a2a2;
    border-radius: 1rem;
    font-size: 1rem;
    text-align: center;
  }
  .cart{
    position: relative;
    top:1rem;
  }
  .cart-item{
    display: flex;
    justify-items: center;
    align-items: center;
    margin:1rem auto 1rem;
    padding:1rem;
    width: 90vw;
    border-radius: .5rem;
    background-color: #fff;
  }
  .check{
    flex: 1;
  }
  .shop-info{
    display: flex;
    flex: 8;
  }
  .title{
    font-size: .8rem;
  }
  .image-box{
    flex: 1;
    padding: 0 1rem 0 0;
  }
  .image-box img{
    position: relative;
    top:1rem;
    width: 5rem;
  }
  .info{
    flex: 3;
  }
  .price-size{
    display: flex;
    margin: .8rem auto;
    align-items: center;
    justify-items: center;
  }
  .price-size div{
    flex: 1;
  }
  .size{
    display: flex;
    margin-left: 1rem;
    height: 1.5rem;
    color: #8a8686;
    font-size: .8rem;
    background-color: #f1eeee;
    text-align: center;
  }
  .size span {
    flex: 1;
    height: 100%;
    line-height: 1.5rem;
  }
  .size span:first-child{
    flex: 1.5;
  }
  .discount-character{
    font-size: .9rem;
  }

  .price{
    color: #e02929;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .count-component{
    margin-left: 50%;
  }
</style>
