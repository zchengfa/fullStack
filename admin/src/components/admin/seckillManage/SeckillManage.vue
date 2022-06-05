<template>
  <el-table :data="$props.seckillData">
    <el-table-column label="商品描述">
      <template #default="scope">
        <span>{{scope.row.product_title}}</span>
      </template>
    </el-table-column>
    <el-table-column label="图片">
      <template #default="scope">
        <img :src="scope.row.product_image" alt="product_image" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "SeckillManage",
  props:['seckillData'],
  setup(props){
    console.log(props.seckillData)

  }
})
</script>

<style scoped>
img{
  width: 5rem
}
</style>