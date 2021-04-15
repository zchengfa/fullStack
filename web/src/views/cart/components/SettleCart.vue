<template>
  <div class="settle-cart">
    <check-button id="check-button" @click.native="selectAll" :is-checked="isCheckedAll"></check-button>
    <label for="check-button">全选</label>
    <div class="total-price">
      <span>共计：</span>
      <span class="price">{{totalPrice}}元</span>
    </div>
  </div>
</template>

<script>
import CheckButton from "@/views/cart/components/CheckButton";
export default {
  name: "SettleCart",
  data(){
    return {
      //保存商品列表数据
      cartList:this.$store.state.cartList,
      //记录商品是否为全选状态
      isAllChecked:false
    }
  },
  components:{
    CheckButton
  },
  computed:{
    totalPrice(){
      let totalPrice = 0
      //遍历商品列表
      this.cartList.map((item)=> {
        //判断当前商品是否勾选，若勾选则返回当前商品的总价
        if (item.isChecked){
          //对价格字符串进行截取并转换成Number类型
          let price = parseFloat(item.price.substr(1,5))

          return totalPrice += price * item.shopCount
        }
      })
      return totalPrice
    },
    isCheckedAll(){
      let checkedNum = 0
      //遍历商品列表
      this.cartList.map((item)=>{
        //判断当前商品是否勾选，已勾选则让勾选数量加一
        if (item.isChecked === true){
          checkedNum ++
          this.isAllChecked = false
        }
      })
      //判断勾选数量是否等于商品列表里的所有商品数量，且商品数量不为空
     if (checkedNum===this.cartList.length && this.cartList.length>0){
       //全部勾选了，让全选按钮处于全选状态
       this.isAllChecked = true
       return true
     }
     return false
    }
  },
  methods:{
    selectAll(){
      //判断是否处于全选状态
      if (this.isAllChecked===true){
        //处于全选状态，让商品列表里的所有商品都取消勾选
        this.cartList.map((item)=> {
          item.isChecked = false
          //取消了勾选，让全选为false
          this.isAllChecked = false
        })
      }
      else {
        //当前为不全选，让为勾选的商品进入勾选状态
        this.cartList.map((item)=>{
          if (item.isChecked !== true){
            item.isChecked = true
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.settle-cart{
  display: flex;
  position: fixed;
  bottom:50px;
  width: 100vw;
  background-color: orange;
}
.total-price{
  position: relative;
  left: 60vw;
  text-align: right;
  background-color: #f00;
}
</style>