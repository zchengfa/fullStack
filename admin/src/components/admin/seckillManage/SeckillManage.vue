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
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {saveFlashTime} from "../../../network/request";

export default defineComponent({
  name: "SeckillManage",
  props:['seckillData'],
  setup(props){
    interface changed {
      id:string,
      time:number,
      index:number
    }

    let seckill = reactive({
      time:<string[]>[],
      changed:<changed[]>[]
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

    return {
      seckill,
      changeFlashSaleTime,
      selectTime,
      saveChanged
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
</style>