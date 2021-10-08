<template>
  <el-table v-show="isShowTable" :data="tableData" >
<!--    <el-table-column v-for="(header,headerIndex) in tableHeader" :key="header"-->
<!--                     :prop="returnTableProp(headerIndex,tableData)"-->
<!--                     :label="header"-->
<!--                     align="center"-->
<!--    >-->
<!--    </el-table-column>-->
    <el-table-column
        prop="title"
        label="商品描述"
        align="center"
    ></el-table-column>
    <el-table-column
        prop="imagePath"
        label="商品图片"
        align="center"
    >
      <template #default="scope">
        <el-image class="table-image" :src="scope.row.imagePath" alt="productImage"></el-image>
      </template>
    </el-table-column>
    <el-table-column
        prop="count"
        label="数量"
        align="center"
    ></el-table-column>
    <el-table-column
        prop="price"
        label="价格"
        align="center"
    ></el-table-column>
  </el-table>
</template>

<script lang="ts">
import {defineComponent} from "vue";
//import {getPropertyArray} from "../../common/utils";

export default defineComponent({
  name: "ShopManage",
  props:{
    isShowTable:{
      type:Boolean,
      default(){
        return true
      }
    },
    tableData:{
      type:Array,
      default(){
        return []
      }
    },
    // tableHeader:{
    //   type:Array,
    //   default(){
    //     return []
    //   }
    // }
  },
  setup(){
    /**
     * @function returnTableProp 是一个返回tableData表中需要的prop值的函数
     * @param index 方法接收index索引值,通过索引值判断这是哪一列
     * @param data 方法接收一个数组,遍历数组得到数组中对象存在的属性名（因为data数组中每个对象中的属性名都一致，只需遍历其中一个对象即可）
     * @param dataPropertyArray 将data数组中对象存在的属性名存储的数组
     */
    // function returnTableProp(index:number,data: any[]) {
    //   let dataPropertyArray = getPropertyArray(data[0])
    //   //因为data数组中每个对象中的属性名都一致，只需遍历第一个对象即可
    //   return dataPropertyArray[index];
    // }
    //
    // return {
    //   returnTableProp
    // }
  }
})
</script>

<style scoped>
.table-image{
  padding: .2rem;
  width: 50%;
  border: 1px solid #bdb6b6;
}
</style>