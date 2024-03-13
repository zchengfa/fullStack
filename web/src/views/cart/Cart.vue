<template>
	<div class="nav-cart">
    <nav-bar class="cart-nav-bar">
      <div slot="center">
        <div class="nav-title">购物车({{cartList.length}})</div>
      </div>
      <div slot="right" @click="manageOrComplete" class="nav-button-box">
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
            <div class="image-box"><img :src="item['product_image']" alt="cart_image" @click="productDetail(item.product_type,item.sell_type,item.product_id,item.id)"></div>
            <div class="info">
              <p class="title">{{item['product_title']}}</p>
              <div class="price-size">
                <div class="price"><span class="discount-character">￥</span><span>{{item['product_price']}}</span></div>
                <div class="size" @click="changeSize(item['size'],item['product_image'],index,item.product_id)"><span>尺码:</span><span>{{item['size']}}</span><span class="down-character">﹀</span></div>
              </div>
              <count class="count-component" :key="countComponentKey" :count="item['quantity']" :index="index"></count>
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
    <change-size class="change-size-component"  :pro-id="changeSizeProId" :product-image="changeSizeImage" :item="changeSizeItem" v-if="isShowChangeSize"></change-size>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar.vue"
  import Scroll from "@/components/common/scroll/Scroll.vue"
  import Empty from "@/components/common/empty/Empty.vue";
  import Recommend from "@/components/content/recommend/Recommend.vue";

  import {recommendMixins} from '@/common/mixins/mixins'

  import CheckButton from "@/views/cart/components/CheckButton.vue"
  import SettleCart from "@/views/cart/components/SettleCart.vue";

  import {getUserCartData,updateChecked, updateProductCount,moveToCollection,remove,updateProductSize,submitOrder} from "@/network/cart";
  import Count from "@/components/content/count/Count.vue";
  import ChangeSize from "@/components/content/changeSize/ChangeSize.vue";

  export  default {
    name:'Cart',
		mixins:[recommendMixins],
    data(){
      return {
        isComplete:false,
        showTotalAndSettle:true,
        cartList: [],
        recommendData:[],
        emptyMessage: '',
        emptyRecommend:'',
        checkedNum:0,
        targets:[],
        updateCheckedTargets:[],
        isShowChangeSize:false,
        changeSizeImage:'',
        changeSizeItem:'',
        changeSizeIndex:-1,
        changeSizeProId:'',
        countComponentKey:0
      }
    },
    components:{
      NavBar,
      Scroll,
      CheckButton,
      SettleCart,
      Empty,
      Recommend,
      Count,
      ChangeSize
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
      //点击列表中的图片，跳转到详情页面查看商品详细数据
      productDetail(product_type,sell_type,product_id,id){
        this.$router.push('/detail/'+sell_type+'/'+product_type +'/'+product_id+'/'+id)
      },
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
        let obj = {
          product_id:this.cartList[index].product_id,
          isChecked:this.cartList[index].isChecked,
          size:this.cartList[index].size
        }
        this.updateCheckedTargets.push(obj)
        //提交更新请求
        this.updateCheckedFunc(this.user_id,this.updateCheckedTargets)

      },
      updateCheckedFunc(user_id,targets){
        updateChecked(user_id,targets).then(res=>{
          //成功后清空this.updateCheckedTargets
          res.data.success?this.updateCheckedTargets = []:null
        })
      },
      //全选与取消全选
      selectAll(){
        //判断当前全选按钮处于什么状态，若是已经是全选状态，则让全选的商品进入未选择状态，若是不处于全选状态，则让未选择的商品进入选中状态
        if (this.checkedNum === this.cartList.length) {
          this.cartList.map((item) => {
            //修改状态
            item.isChecked = false

            let obj = {
              product_id:item.product_id,
              isChecked:item.isChecked,
              size:item.size
            }
            this.updateCheckedTargets.push(obj)

          })
          //将修改后的状态提交给后端，让后端修改数据库中该用户的状态
          this.updateCheckedFunc(this.user_id,this.updateCheckedTargets)
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
            let obj = {
              product_id:item.product_id,
              isChecked:item.isChecked,
              size:item.size
            }
            this.updateCheckedTargets.push(obj)
          })
          console.log(this.user_id)
          //将修改后的状态提交给后端，让后端修改数据库中该用户的状态
          this.updateCheckedFunc(this.user_id,this.updateCheckedTargets)
        }
      },
      settle(){
        //点击结算按钮时先判断是否选择了商品
        if (this.checkedNum) {
          //将选中的商品信息提交给后端
          let orderArr = []
          let total_num= 0
          let total_price = 0
          this.cartList.map(item=>{
            if (item.isChecked){
              orderArr.push({
                'product_id':item.product_id,
                'product_num':item.quantity,
                'product_size':item.size,
                'sell_type':item.sell_type,
                'product_type':item.product_type
              })

              total_num += item.quantity
              total_price += item.quantity * item.product_price
              
            }
          })
          
          submitOrder(this.user_id,orderArr,total_num,total_price).then(res=>{
            if (res.data.order_id){
              //将订单编号分发给vuex状态管理
              this.$store.dispatch('saveOrderID',res.data.order_id)

              //进入订单页面
              this.$router.push('/order')
            }
          }).catch(err=>{
            console.log(err)
          })
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

                  //刷新组件
                  this.refreshScrollComponent()
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
      refreshScrollComponent(){
        //DOM更新后再次刷新scroll组件（用户购物车商品多时一次性收藏后后会出现大片空白区域，所以需要刷新scroll组件解决）
        this.$nextTick(()=>{
          this.$refs.scroll.scroll.refresh()
        })
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

            //刷新组件
            this.refreshScrollComponent()
            }
          })
        }
         else{
          this.$toast.showToast('您还没有选择任何商品！')
        }
        
      },
      //获取用户购物车数据函数
      getUserCartData (user_id) {
        getUserCartData(user_id).then(res => {
          //清空之前的数据
          this.cartList = []
          //判断是否存在用户购物车数据
          if(res.data.user_cart_data) {
            //获取user_id
            //this.user_id = res.data.user_id
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
        }
      },
      //点击尺码盒子更改尺码
      changeSize(size,image,index,proId){
        this.isShowChangeSize = true
        this.changeSizeItem = size
        this.changeSizeImage = image
        this.changeSizeIndex = index
        this.changeSizeProId = proId
      }
    },
    created() {
      if (this.$store.state.token){
        let userInfo = this.$store.state.userInfo
        this.user_id = userInfo.user_id

        this.isLogin = false

        //存在token值，用户已登录，执行获取用户购物车数据函数
        //进入购物车页面，获取用户token，执行获取用户购物车数据函数
        this.getUserCartData(this.user_id)

        //获取用户对应的推荐数据
        this.getUserRecommend(this.user_id)

      }
      else {
        //token值不存在，用户未登录，获取默认的推荐数据
        this.getCommonRecommend()
        this.isLogin = true
      }
    },
    mounted() {
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

      })

      this.$bus.$on('submitChangeSize',(e)=>{
        let size = e.size
        let product_id = e.proId
        //点击确认更改尺码按钮后先判断跟之前的尺码是否一样，若一样，则无需向后端发送更改尺码的请求，反之则发起更改尺码请求
        if (this.changeSizeItem !== size &&size){
          updateProductSize(this.user_id,product_id,this.changeSizeItem,size).then(res=>{
            console.log(res)
            //是更新尺码或合并商品成功的响应，将新尺码给该商品
            if (res.data.updateSuccess || res.data.mergeSuccess){
              this.cartList[this.changeSizeIndex].size = size
            }

            //若是合并商品成功响应，不仅需要更新尺码，还得更新数量，并且还需将购物车中相同数据且除点击外的商品进行删除，只保留点击的商品项
            if (res.data.mergeSuccess){
                //遍历购物车数据，查询当前操作商品的相同（尺码）数据项
              //相同数据的索引
              let sameProIndex = []

              //合并后的数量
              let mergeQuantity = 0

              //需要删除的数据的索引
              let needDeleteIndex = null
              this.cartList.map((item,index)=>{
                //如果是尺码相同并且不是用户点击的那一项商品，将其删除
                if (item.size===size && item.product_id===this.cartList[this.changeSizeIndex].product_id){
                  sameProIndex.push(index)
                }
               if(item.size===size && item.product_id===this.cartList[this.changeSizeIndex].product_id && index !==this.changeSizeIndex){
                  needDeleteIndex = index
                }
              })

              sameProIndex.map(item=>{
                mergeQuantity +=this.cartList[item].quantity
              })

              this.cartList[this.changeSizeIndex].quantity = mergeQuantity
              this.cartList[this.changeSizeIndex].id = res.data.id

              //改变count组件的key值，重新渲染组件,以更新数据
              this.countComponentKey +=1

              this.cartList.splice(needDeleteIndex,1)

            }
          })
        }
        this.isShowChangeSize = false
      })
    },
    beforeDestroy() {
      //在组件销毁前手动注销事件，事件总线在路由往返时不会自动注销事件，没往返一次就会增加一次事件，所以需要手动注销
      this.$bus.$off('submitChangeSize')
      this.$bus.$off('addCount')
      this.$bus.$off('reduceCount')
    }
  }
</script>

<style scoped>

  .nav-cart{
    width: 100vw;
    height: 100vh;
    max-width: 500px;
  }
  .nav-button-box{
    margin-right: 1rem;
    width: 3rem;
    height: 100%;
  }
  .manage,.complete{
    width: 3rem;
    height: 44px;
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
  /*用户购物车中有商品时会使计算组件出现，所以需要更少的可视滚动区域*/
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
    padding: .5rem 0;
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
    width: 90%;
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
    min-width: 6rem;
    color: #8a8686;
    font-size: 12px;
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
  .change-size-component{
    position: fixed;
    top:0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(138, 134, 134, 0.2);
    z-index: 13;
  }
</style>
