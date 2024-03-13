<template>
  <div class="settle-cart">
    <div class="check" @click="selectAll">
      <check-button  id="check-button" :class="{checked:isAllChecked}"></check-button>
      <label v-show="!isAllChecked" for="check-button" class="select-all">全选</label>
      <label v-show="isAllChecked" for="check-button" class="deselect-all">取消全选</label>
    </div>
    <div class="total-price" v-show="showTotalAndSettle">
      <span>合计:</span>
      <span class="price">￥{{totalPrice}}元</span>
    </div>
    <div class="settle" @click="settle" v-show="showTotalAndSettle">
      <button>去结算({{settleNum}})</button>
    </div>
    <div class="delete" v-show="!showTotalAndSettle">
      <button class="move-to-collection" @click="moveToCollection">移入收藏夹</button>
      <button class="remove" @click="remove">删除</button>
    </div>
  </div>
</template>

<script>
import CheckButton from "@/views/cart/components/CheckButton";
export default {
  name: "SettleCart",
  props:{
    settleCart:{
      type:Object,
      default() {
        return {}
      }
    },
    totalPrice:{
      type:Number,
      default() {
        return 0
      }
    },
    settleNum:{
      type:Number,
      default() {
        return 0
      }
    },
    isAllChecked:{
      type:Boolean,
      default() {
        return false
      }
    },
    showTotalAndSettle:{
      type:Boolean,
      default(){
        return true
      }
    }
  },
  data(){
    return {}
  },
  components:{
    CheckButton
  },
  methods:{
    //全选
    selectAll() {
      this.$emit('selectAll')
    },
    //结算
    settle(){
      this.$emit('settle')
    },
    //移入收藏夹
    moveToCollection(){
      this.$emit('moveToCollection')
    },
    //将商品从用户购物车中移除
    remove(){
      this.$emit('remove')
    }
  },
  mounted() {


  }
}
</script>

<style scoped>
.settle-cart{
  position: fixed;
  bottom: 3rem;
  display: flex;
  width: 100%;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  background-color: #fff;
  z-index: 99;
}
.settle-cart div{
  display: flex;
  justify-content: center;
  align-items: center;
}
.check-button{
  margin-right: .5rem;
}
.total-price{
  color: #ee0c2e;
}
.settle{
  padding: .3rem;
  background-color: #e5580d;
  border-radius: 1rem;
}
.settle button,.delete button{
  color: #fff;
}
.delete button{
  padding: .3rem .5rem;
  border-radius: 1rem;
  font-size: 14px;
}
.delete button:first-child{
  background-color: red;
}
.delete button:last-child{
  margin-left: 1rem;
  background-color: #d48a1b;
}
</style>