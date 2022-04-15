<template>
<div v-show="$props.isReceive" class="confirm-receive">
  <div class="content">
    <p>您是否收到该订单商品？</p>
    <div class="button-box">
      <button @click="receiveNone">未收货</button>
      <button @click="receiveHad">已收货</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "ConfirmOrder",
  props:{
    isReceive:{
      type:Boolean,
      default(){
        return true
      }
    }
  },
  methods:{
    receiveNone(){
      this.$emit('receiveNone')
    },
    receiveHad(){
      this.$emit('receiveHad')
    }
  }
}
</script>

<style scoped>
.confirm-receive{
  position: absolute;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(66, 64, 64, 0.3);
  z-index: 13;
}
.content{
  position: relative;
  top: 50%;
  left: 50%;
  padding: 1rem;
  width: 80%;
  max-width: 24rem;
  background-color: #fff;
  border-radius: .5rem;
  text-align: center;
  transform: translateY(-50%) translateX(-50%);
}
.content p{
  font-weight: bold;
}
.content button{
  margin-top: 1rem;
  width: 7rem;
  height: 2rem;
  border-radius: 1rem;
  color: #fd001e;
}
.content button:first-child{
  border: 1px solid #fd001e;
}
.content button:last-child{
  margin-left: 1rem;
  color: #fff;
  background-color: #fd001e;
}
</style>