<template>
  <div class="settle-cart">
    <div class="check" @click="selectAll">
      <div class="check-button" id="check-button">
        <button :class="{checked:isAllChecked}"></button>
      </div>
      <label v-if="!isAllChecked" for="check-button" class="select-all">全选</label>
      <label v-else for="check-button" class="deselect-all">取消全选</label>
    </div>
    <div class="total-price">
      <span>合计:</span>
      <span class="price">￥{{totalPrice}}元</span>
    </div>
    <div class="settle" @click="settle">
      <button>去结算({{settleNum}})</button>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data(){
    return {}
  },
  methods:{
    selectAll() {
      this.$bus.$emit('selectAll')
    },
    settle(){
      this.$emit('settle')
    }
  },
  mounted() {


  }
}
</script>

<style scoped>
.settle-cart{
  display: flex;
  position: fixed;
  bottom:50px;
  width: 100vw;
  height: 3rem;
  text-align: center;
  line-height: 3rem;
  border: 1px solid transparent;
  border-top-color: #d5cbcb;
  background-color: #fff;
}
.check{
  flex: 1;
}
#check-button{
  display: inline-block;
  width: 2rem;
  height: 100%;
}
#check-button button{
  position: relative;
  top: 50%;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-image: url("~assets/image/cart/check.svg");
  transform: translateY(-50%);
}
#check-button button.checked{
  background-image: url("~assets/image/cart/checked.svg");
}
label{
  position: relative;
  left: .5rem;
  font-size: .6rem;
}
.total-price{
  flex: 2;
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
  flex: 1.5;
}
.settle button{
  width: 80%;
  height: 80%;
  color: #fff;
  border-radius: 2rem;
  background-color: #f00;
}

</style>