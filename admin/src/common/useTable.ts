//利用CompositionApi实现类似vue2的mixins混入效果
import { reactive , watchEffect } from "vue";

//导出函数（接收一个每页多少条数据参数）
export default function (size:number) {
  let table = reactive({
     data:<string[]>[],
     tableData:<string[]>[],
     pageSize:<number>size
  })

  //实现element-plus分页组件的@current-change方法(@current-change="currentPageChange")
  const currentPageChange = (val:number)=>{
    if (val===1){
     table.tableData = sliceTableData(val-1,table.pageSize)
   }
   else {
    table.tableData = sliceTableData((val-1)*table.pageSize,((val-1)*table.pageSize)+table.pageSize)
   }
 }

  //提取对应部分的数据
  const sliceTableData = (start:number,end:number)=>{
    return table.data.slice(start,end)
  }

  //监听tableData的值
  watchEffect(()=>{
    table.tableData = sliceTableData(0,table.pageSize)
  })

  return {
    table,
    currentPageChange,
    sliceTableData
  }
}