<template>
          <div class="button-box">
            <button class="reduce" :disabled="quantity<=1" @click="reduceCount">-</button>
            <span class="quantity">{{quantity}}</span>
            <button class="add" @click="addCount">+</button>
          </div>
</template>

<script>
export default {
  name: "Count",
  props:{
    count:{
      type:Number,
      default(){
        return 1
      }
    },
    index:{
      type:Number,
      default() {
        return -1;
      }
    }
  },
  data(){
    return {
      quantity:this.count,
      Index:this.index
    }
  },
  methods:{
    reduceCount(){
      this.quantity>=1?this.quantity--:null
      this.$bus.$emit('reduceCount',{
        quantity:this.quantity,index:this.Index
      })

    },
    addCount(){
      this.quantity++
      this.$bus.$emit('addCount',{
        quantity:this.quantity,index:this.Index
      })

    }
  }
}
</script>

<style scoped>
.button-box{
  display: flex;
  width: 6rem;
  height: 1.5rem;
  min-width: 5rem;
  text-align: center;
  border: 1px solid #a9a9a9;
  border-radius: .75rem;
  line-height: 1.5rem;
}
.button-box>button,.button-box>span{
  flex: 1;
}
.button-box button{
  font-size: 1.2rem;
  line-height: 0;
}
.button-box button:first-child{

}
.button-box span{
  height: 100%;
  border: 1px solid #a9a9a9;
  border-bottom: transparent;
  border-top: transparent;
  font-size: .9rem;

}
</style>