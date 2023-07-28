<script lang="ts" setup >
import zhCn from "element-plus/lib/locale/lang/zh-cn";


let locale = zhCn;

//接收父组件传过来的值
let props = defineProps({
  total:{
    type:Number,
    default(){
      return 0
    }
  }
})

//向父组件发送事件
let emits = defineEmits(['currentPageChange'])
const currentPageChange = (val:any)=>{
  emits('currentPageChange',val)
}


</script>

<template>
  <el-config-provider :locale="locale">
    <el-pagination class="pagination" layout=" prev, pager, next, jumper , slot ,total" :page-size="7" :total="total" @current-change="currentPageChange">
      <span class="pagination-span"></span>
    </el-pagination>
  </el-config-provider>
</template>

<style scoped>
.pagination{
  padding: 20px 0;
}
.pagination-span{
  margin:0 10px;
}
</style>