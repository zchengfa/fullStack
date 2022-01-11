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
  display: flex;
  width: 100%;
  height: 3rem;
  bottom: 3rem;
  line-height: 3rem;
  background-color: #fff;
}
.check{
  display: flex;
  flex: 1;
  justify-items: center;
  align-items: center;
}
#check-button{
  margin-left: .8rem;
}
label{
  flex: 1;
  font-size: .8rem;
  text-align: center;
}

.total-price{
  flex: 1.5;
}
.total-price span{
  display: inline-block;
  height: 100%;
}
.price{
  font-weight: bold;
  color: #f00;
}
.settle{
  flex: 1.2;
}
.settle button{
  width: 70%;
  height: 70%;
  color: #fff;
  border-radius: 2rem;
  background-color: #f00;
}
.delete{
  flex: 3;
  text-align: right;
}
.delete button{
  width: 30%;
  height: 64%;
  border-radius: 2rem;
  border: 1px solid #faa201;
  font-size: small;
  color: #faa201;
}
.delete .remove{
  margin-right: .8rem;
  margin-left: 1rem;
  width: 20%;
  border: 1px solid #f10a39;
  color: #f10a39;
}
</style>