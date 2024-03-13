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
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid #8a8a8a;
  border-radius: 1rem;
}
.button-box span{
  padding: 0 .4rem;
  border-left: 1px solid #8a8a8a;
  border-right: 1px solid #8a8a8a;
}
.button-box .add,.button-box .reduce{
  color: #000;
}
</style>