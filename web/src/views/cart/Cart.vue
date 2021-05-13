<template>
	<div class="nav-cart">
    <nav-bar>
      <div slot="center">
        <div class="nav-title">购物车({{cartList.length}})</div>
      </div>
    </nav-bar>
    <Scroll class="content" ref="scroll">
      <div class="cart" v-if="cartList.length">
        <div class="cart-item" v-for="(item,index) in cartList" :key="index">
          <check-button class="check" :is-checked="Boolean(item.isChecked)" @click.native="changeChecked(index)"></check-button>
          <div class="shop-info">
            <div class="image-box"><img :src="item.product_image" alt="cart_image"></div>
            <div class="info">
              <p class="title">{{item.product_title}}</p>
              <p class="price">{{item.product_price}}</p>
              <div class="button-box">
                <button class="reduce" :disabled="item.product_count <= 1" @click="reduceCount(index)">-</button>
                <span class="quantity">{{item.product_count}}</span>
                <button class="add" @click="addCount(index)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else-if="!cartList.length && !isLogin" :empty-message="emptyMessage"></Empty>
      <div class="login-tip" v-if="isLogin">
        <span>您还未登录</span>
        <router-link class="to-login" :to="{path:'/login'}">马上登录</router-link>
      </div>
      <Recommend :recommend-data="recommendData" recommend-title="为你推荐"></Recommend>
    </Scroll>

    <settle-cart :total-price="totalPrice"
                 :settle-num="settleNum"
                 v-show="cartList.length"
                 :is-all-checked="isAllChecked"
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

  import {getCommonRecommend,getUserRecommend,getUserCartData,updateChecked,updateProductCount} from "@/network/cart";

  export  default {
    name:'Cart',
    data(){
      return {
        cartList: [],
        user_id:'',
        isLogin:false,
        recommendData:[],
        emptyMessage: '',
        emptyRecommend:'',
        checkedNum:0
      }
    },
    components:{
      NavBar,
      Scroll,
      CheckButton,
      SettleCart,
      Empty,
      Recommend
    },
    computed:{
      totalPrice () {
        //将计算好的总价格传给子组件
        let price = 0
        this.cartList.map((item) => {
          if (item.isChecked) {
            price += item.product_count * item.product_price.substr(1,5)
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
      //减少用户所点击的商品数量函数
      reduceCount(index){
        //减少对应商品的数量
        this.cartList[index].product_count --

        //提交减少该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index].product_count).then()
        console.log(index,this.cartList[index])
      },
      //增加用户所点击的商品数量函数
      addCount(index){
         //增加对应商品的数量
         this.cartList[index].product_count ++

        //提交增加该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index].product_count).then()
        console.log(index,this.cartList[index])
      },
      changeChecked(index){
        //点击选中按钮，修改按钮状态，并将修改后的状态提交到后端
        this.cartList[index].isChecked = !this.cartList[index].isChecked

        //提交更新请求
        updateChecked(this.user_id, this.cartList[index].product_id, this.cartList[index].isChecked).then()

      },
      //获取商品推荐数据函数
      getCommonRecommend(){
        getCommonRecommend().then(res => {
          this.recommendData = res.data.commonRecommend
        }).catch(err => {
          console.log(err)
        })
      },
      getUserRecommend(){
        getUserRecommend().then(res => {
          console.log(res)
          if (res.data.empty) {
            this.emptyRecommend = res.data.empty
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //获取用户购物车数据函数
      getUserCartData (token) {
        getUserCartData(token).then(res => {
          //清空之前的数据
          this.cartList = []
          //判断是否存在用户购物车数据
          if(res.data.user_cart_data) {
            //获取user_id
            this.user_id = res.data.user_cart_data[1].user_id

            //遍历数组
            res.data.user_cart_data[0].map((item) => {
              //提取数据中的购物车数据
              this.cartList.push(item)
            })

          }
          else {
            this.emptyMessage = res.data.empty
          }
        })
      }
    },
    mounted() {
      this.$bus.$on('selectAll',() => {
        //判断当前全选按钮处于什么状态，若是已经是全选状态，则让全选的商品进入未选择状态，若是不处于全选状态，则让未选择的商品进入选中状态
        if (this.checkedNum === this.cartList.length) {
          this.cartList.map((item) => {
            //修改状态
            item.isChecked = false

            //将修改后的状态提交给后端，让后端修改数据库中该用户的状态
            updateChecked(this.user_id,item.product_id,item.isChecked).then()
          })
        }
        else {
          this.cartList.map((item) => {
            item.isChecked = true

            //将修改后的状态提交给后端，让后端修改数据库中该用户的状态
            updateChecked(this.user_id,item.product_id,item.isChecked).then()
          })
        }
      })

      const refresh = debounce(this.$refs.scroll.refresh, 200)
      this.$bus.$on('itemImageLoad',() => {
        refresh()
      })
    },
    activated() {

      if (this.$refs.scroll){
        //进入页面时刷新scroll
        this.$refs.scroll.scroll.refresh()
      }
     //判断用户是否登录,若已登录显示用户的购物车物品列表,未登录，显示登录提示
     const  token = sessionStorage.getItem('token')
     if (token){
       this.isLogin = false

       //存在token值，用户已登录，执行获取用户购物车数据函数
       //进入购物车页面，获取用户token，执行获取用户购物车数据函数
       this.getUserCartData(token)

       //获取用户对应的推荐数据
       // this.getUserRecommend('111')
       // console.log(token)

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
    height: 100vh;
  }
  .nav-bar{
    background-color: #db7093;
  }
  .nav-title{
    color: #fff;
  }
  .content{
    height: calc(100% - 98px);
    overflow: hidden;
    background-color: #fff;
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
    font-size: .5rem;
    text-align: center;
  }
  .cart{

  }
  .cart-item{
    display: flex;
    margin:0 auto 1rem;
    width: 96vw;
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
    top:1rem
  }
  .info{
    flex: 3;
  }
  .image-box img{
    width: 5rem;
    height: 6rem;
  }
  .price{
    color: #e02929;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .button-box{
    position: relative;
    left: 60%;
    width: 40%;
  }
  .button-box button{
    width: 1.6rem;
    height: 1.6rem;
    font-weight: bold;
  }
  .button-box span{
    padding: 0 .5rem;
  }
</style>
