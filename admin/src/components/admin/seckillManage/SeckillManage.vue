<template>
  <el-table :data="table.currentPageData" class="mall-table" border>
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
    <el-table-column label="操作" fixed="right" align="center">
      <template #default="scope">
        <div class="operation-btn">
          <el-button class="edit-btn" size="small" type="danger" @click.prevent="removeSeckillData(scope.row.product_id,scope.$index)">移出秒杀活动栏</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-button v-show="seckill.changed.length" @click="saveChanged" type="success" size="small" class="save-button">保存编辑</el-button>
  <el-button class="add-seckill-button" @click="addSeckill" type="danger" size="small">添加秒杀商品</el-button>
  <add-seckill @close-add-seckill="closeAddSeckill" :no-seckill-data="seckill.noSeckillData" class="add-seckill-box"></add-seckill>
  <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>
</template>

<script lang="ts">
import {defineComponent, reactive,getCurrentInstance,ComponentInternalInstance, onBeforeUnmount} from "vue";
import { saveFlashTime,removeSeckill,addSeckillRequest } from "../../../network/request";
import AddSeckill from './AddSeckill.vue'
import Pagination from "../../common/Pagination.vue";
import useTable from '../../../common/useTable'
import { shopStore } from "../../../pinia/pinia";

export default defineComponent({
  name: "SeckillManage",
  props:['seckillData','noSeckillData'],
  components:{
    Pagination,
    AddSeckill
  },
  setup(props){
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const { table,currentPageChange } = useTable(6)
    const { data } = shopStore()

    interface changed {
      id:string,
      time:number,
      index:number
    }

    let seckill = reactive({
      time:<Array<string>>[],
      changed:<Array<changed>>[],
      isShowAddSeckill:<boolean>false,
      noSeckillData:<Array<any>>[],
    })

    let preferentialData:Array<any> = []

    data.forEach((item)=>{
      if(item.preferential_type === '秒杀'){
        preferentialData.push(item)
      }
      else{
        seckill.noSeckillData.push(item)
      }
    })
    //table.manageData = data
    table.tableData = preferentialData

    //点击时间按钮，控制el-select-time组件的显示与隐藏
    const changeFlashSaleTime = function (index:number) {

      let beginTimeButton:HTMLElement =<HTMLElement> document.getElementsByClassName('begin-time-button').item(index)
      beginTimeButton.style.display = 'none'

      let changeTime:HTMLElement = <HTMLElement> document.getElementsByClassName('change-time').item(index)
      changeTime.style.display = 'block'

    }

    //将新时间添加到seckill.changed中
    const selectTime = function (index:number,val:string,id:string) {
      seckill.changed.push({
        id:id,
        time:parseInt(val.replace(':00','')),
        index:index
      })
    }

    //保存新的秒杀时间
    const saveChanged = function () {
      saveFlashTime(seckill.changed).then(res=>{
        if (res.data.saveResult){
          seckill.changed.map((item:{index:number,id:string,time:number})=>{

            let changeTime:HTMLElement = <HTMLElement> document.getElementsByClassName('change-time').item(item.index)
            changeTime.style.display = 'none'

            table.tableData.map((seckillItem:{product_id:string,flash_sale_time:number})=>{
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

    //点击添加秒杀商品按钮，Add-seckill组件从右往左出现
    const addSeckill = function (){
      setAnimation('add-seckill-box','rtl')
    }

    //点击关闭秒杀按钮，Add-seckill组件从左往右出现
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

      //ltr从左往右出现，rtl从右往左出现
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

    //点击删除按钮，将商品移除秒杀活动 
    const removeSeckillData = function (id:string,index:number){
      removeSeckill(id).then(res=>{
        if (res.data.removeResult){
          table.tableData.splice(index,1)
        }
      })
    }


    // })
    //监听事件总线发出的confirmAddSeckill事件
    appContext.config.globalProperties.$bus.on('confirmAddSeckill',(obj:{data:string[],time:string})=>{

      //获得添加到秒杀活动的商品数据，向后端发起请求将对应商品一一更改为秒杀商品
      addSeckillRequest(obj.data,parseInt(obj.time.replace(':00',''))).then(res=>{
        if (res.data.addResult){

          obj.data.map((item:any)=>{
            seckill.noSeckillData.map((noItem:any,index:number)=>{
              if (item.product_id===noItem.product_id){
                seckill.noSeckillData.splice(index,1)
                table.tableData.push(item)
                //seckill.key++
              }
            })
          })
          alert('已将您选择的商品加入到秒杀活动中')
          closeAddSeckill()
        }
      })

    })

    onBeforeUnmount(()=>{
      appContext.config.globalProperties.$bus.off('confirmAddSeckill')
    })

    return {
      seckill,
      changeFlashSaleTime,
      selectTime,
      saveChanged,
      addSeckill,
      closeAddSeckill,
      removeSeckillData,
      table,currentPageChange
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
  margin-top: 20px;


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