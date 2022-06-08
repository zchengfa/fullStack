<template>
  <el-table :data="$props.seckillData" border>
    <el-table-column label="商品描述"  align="center">
      <template #default="scope">
        <span>{{scope.row.product_title}}</span>
      </template>
    </el-table-column>
    <el-table-column label="图片" align="center">
      <template #default="scope">
        <img :src="scope.row.product_image" alt="product_image" :title="scope.row.product_title"/>
      </template>
    </el-table-column>
    <el-table-column label="活动类型"  align="center">
      <template #default="scope">
        <span class="activity">{{scope.row.preferential_type}}</span>
      </template>
    </el-table-column>
    <el-table-column label="开始时间"  align="center">
      <template #default="scope">
        <el-button class="begin-time-button" size="small" @click.prevent="changeFlashSaleTime(scope.$index)">{{scope.row['flash_sale_time']+':00'}}</el-button>
        <el-time-select class="change-time" v-show="false" v-model="seckill.time[scope.$index]" start="00:00" step="02:00" end="22:00" @change="selectTime(scope.$index,seckill.time[scope.$index],scope.row.product_id)"></el-time-select>
      </template>
    </el-table-column>
    <el-table-column label="结束时间"  align="center">
      <template #default="scope">
        <span>{{scope.row['flash_sale_time']+2+':00'}}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-button v-show="seckill.changed.length" @click="saveChanged" type="success" size="small" class="save-button">保存编辑</el-button>
  <el-button class="add-seckill-button" @click="addSeckill" type="danger" size="small">添加秒杀商品</el-button>
  <add-seckill @close-add-seckill="closeAddSeckill" :no-seckill-data="$props.noSeckillData" class="add-seckill-box"></add-seckill>
</template>

<script lang="ts">
import {defineComponent, reactive,getCurrentInstance,ComponentInternalInstance} from "vue";
import {saveFlashTime} from "../../../network/request";
import AddSeckill from './AddSeckill.vue'


export default defineComponent({
  name: "SeckillManage",
  props:['seckillData','noSeckillData'],
  components:{
    AddSeckill
  },
  setup(props){
    const {appContext} = getCurrentInstance() as ComponentInternalInstance

    interface changed {
      id:string,
      time:number,
      index:number
    }

    let seckill = reactive({
      time:<string[]>[],
      changed:<changed[]>[],
      isShowAddSeckill:<boolean>false
    })

    const changeFlashSaleTime = function (index:number) {

      let beginTimeButton:HTMLElement =<HTMLElement> document.getElementsByClassName('begin-time-button').item(index)
      beginTimeButton.style.display = 'none'

      let changeTime:HTMLElement = <HTMLElement> document.getElementsByClassName('change-time').item(index)
      changeTime.style.display = 'block'

    }

    const selectTime = function (index:number,val:string,id:string) {
      seckill.changed.push({
        id:id,
        time:parseInt(val.replace(':00','')),
        index:index
      })
    }

    const saveChanged = function () {
      saveFlashTime(seckill.changed).then(res=>{
        if (res.data.saveResult){
          seckill.changed.map((item:{index:number,id:string,time:number})=>{

            let changeTime:HTMLElement = <HTMLElement> document.getElementsByClassName('change-time').item(item.index)
            changeTime.style.display = 'none'

            props.seckillData.map((seckillItem:{product_id:string,flash_sale_time:number})=>{
              if (seckillItem.product_id===item.id){
                seckillItem.flash_sale_time = item.time
              }
            })

            let beginTimeButton:HTMLElement =<HTMLElement> document.getElementsByClassName('begin-time-button').item(item.index)
            beginTimeButton.style.display = 'block'
            beginTimeButton.style.margin = '0 auto'

          })
        }
      })
    }

    const addSeckill = function (){
      setAnimation('add-seckill-box','rtl')
    }

    const closeAddSeckill = function (){
      setAnimation('add-seckill-box','ltr')
    }

    const setAnimation =function (className:string,direction:string='rtl'){
      let e = <HTMLElement> document.getElementsByClassName(className).item(0)
      direction==='rtl'?(()=>{
        let c = 0
        let intervalTimer = setInterval(()=>{
          c++
          e.style.transform = `translateX(-${c}%)`
          c>=100?clearInterval(intervalTimer):null
        })
      })():null

      direction==='ltr'?(()=>{
        let c = 100
        let intervalTimer = setInterval(()=>{
          c--
          e.style.transform = `translateX(-${c}%)`
          c<=0?clearInterval(intervalTimer):null
        })
      })():null

      if (direction!=='ltr'&& direction!=='rtl'){
        throw new Error('your direction should be rtl or ltr')
      }

    }

    // const confirmAddSeckill = function (){
    //   closeAddSeckill()
    // }

    //监听AddSeckill子组件发出的confirmAddSeckill事件
    appContext.config.globalProperties.$bus.on('confirmAddSeckill',()=>{
      closeAddSeckill()
    })

    return {
      seckill,
      changeFlashSaleTime,
      selectTime,
      saveChanged,
      addSeckill,
      closeAddSeckill,
      //confirmAddSeckill
    }
  }
})
</script>

<style scoped>
.activity{
  color: #fd001e;
}
img{
  width: 3rem
}
.save-button{
  margin: 5vh auto;
}
.add-seckill-button{
  margin-top: 5vh;

  margin-bottom: 5vh;
}
.add-seckill-box{
  position: fixed;
  left:calc(100vw + 48px);
  top:48px;
  width: 35vw;
  height: calc(100vh - 48px);
  background-color: #f3eeee;
  z-index: 11;
}
</style>