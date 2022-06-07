<template>
<div class="add-seckill">添加
  <el-button size="small" circle class="close" @click="closeAddSeckill"><el-icon><Close></Close></el-icon></el-button>
  <div class="item-box" v-for="(item,index) in $props.noSeckillData" :key="index">
    <div class="item"><img :src="item.product_image" :alt="item.product_title"><span>{{item.product_title}}</span></div>
  </div>
</div>
</template>

<script lang="ts">
import {Close} from "@element-plus/icons-vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "AddSeckill",
  emits:['closeAddSeckill'],
  props:['noSeckillData'],
  components:{
    Close
  },
  setup(props,context){
    const closeAddSeckill = ()=>{
      context.emit('closeAddSeckill')
    }

    return {
      closeAddSeckill
    }
  }
})
</script>

<style scoped>
.add-seckill{
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.add-seckill::-webkit-scrollbar{
  display: none;
}
.close{
  position: absolute;
  left: 0;
  top:0;
  background-color: #fff;
  transform: translateX(-50%);
}
.add-seckill .item-box{
  width: 100%;
}
img{
  width: 100%;
}
.add-seckill .item{
  display: inline-block;
  width: 30%;
}
</style>