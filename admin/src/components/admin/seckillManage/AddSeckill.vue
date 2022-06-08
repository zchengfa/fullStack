<template>
<div class="add-seckill">
  <el-button size="small" circle class="close" @click="closeAddSeckill"><el-icon><Close></Close></el-icon></el-button>
  <div>
    <el-button type="success" size="small" @click="confirmAddSeckill" v-show="noSeckill.data.length">确认添加</el-button>
    <span class="count-tip">共计{{$props.noSeckillData.length}}件商品可加入秒杀活动</span>
  </div>
  <div class="item-box">
    <div class="item" v-for="(item,index) in $props.noSeckillData" :key="index" @click="selectProduct(item,index)">
      <img :src="item.product_image" :alt="item.product_title"><p>{{item.product_title}}</p>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Close} from "@element-plus/icons-vue";
import {defineComponent, reactive,getCurrentInstance,ComponentInternalInstance} from "vue";


export default defineComponent({
  name: "AddSeckill",
  emits:['closeAddSeckill'],
  props:['noSeckillData'],
  components:{
    Close
  },
  setup(props,context){
    const {appContext} = getCurrentInstance() as ComponentInternalInstance

    let noSeckill = reactive({
      data:<string[]>[]
    })

    const closeAddSeckill = ()=>{
      context.emit('closeAddSeckill')
    }

    const selectProduct = (item: any, index: number)=>{
      let el = <HTMLElement>document.getElementsByClassName('item').item(index)

      if (!noSeckill.data.length){
        noSeckill.data.push(item)
        el.className = 'item active-item'
      }
      else{
        let finishCount = 0
        noSeckill.data.map((seckill:any,seckillIndex:number)=>{
          if (seckill.product_id===item.product_id){
            noSeckill.data.splice(seckillIndex,1)
            el.className = 'item'
          }
          finishCount++
          if (finishCount===noSeckill.data.length){
              noSeckill.data.push(item)
              el.className = 'item active-item'
          }
        })
      }
    }

    const confirmAddSeckill = ()=>{
      appContext.config.globalProperties.$bus.emit('confirmAddSeckill',noSeckill.data)
    }

    return {
      closeAddSeckill,
      selectProduct,
      noSeckill,
      confirmAddSeckill
    }
  }
})
</script>

<style scoped>
.add-seckill{
  position: relative;
  width: 100%;
  height: 100%;
}
.add-seckill .item-box{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 80%;
  height: 100%;
  overflow-y: scroll;
  background-color: #FFFFFF;
  transform: translateX(-24px);
}
.add-seckill .item-box::-webkit-scrollbar{
  display: none;
}
.count-tip{
  display: inline-block;
  padding: 1.5rem;
  color: #8a8686;
  font-size: 12px;
  letter-spacing: 2px;
}
.close{
  position: absolute;
  left: 0;
  top:0;
  background-color: #fff;
  transform: translateX(-50%);
}
.add-seckill .item{
  margin: 2vh auto;
  width: 40%;
  background-color: #f3eeee;
  border-radius: .5rem;
}
.item img{
  width: 80%;
}
.item p{
  margin: .5rem auto;
  width: 90%;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.active-item{
  border: 1px solid #fd001e;
}
</style>