<template>
  <el-table class="mall-table" :data="currentPageData.pageData" @selection-change="selection" border empty-text="商品数据为空">
    <el-table-column type="selection"></el-table-column>
    <el-table-column prop="id" label="商品ID">
      <template #default="scope">
        <span class="product-id">{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="商品描述" align="center">
      <template #default="scope">
        <span class="title">{{scope.row.title}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="imagePath" label="商品图片" align="center">
      <template #default="scope">
        <el-image class="table-image" :src="scope.row.imagePath" alt="productImage"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="count" label="库存" align="center"></el-table-column>
    <el-table-column prop="price" label="价格" align="center">
      <template #default="scope">
        <span class="price">{{scope.row.price}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center">
      <template #default="scope">
        <div class="operation-btn">
          <el-button class="edit-btn" size="small" @click.prevent="editProduct(scope.$index,tableData)">编辑</el-button>
          <el-button class="delete-btn" size="small" @click.prevent="deletePro(scope.$index,tableData)">删除</el-button>
        </div>
      </template>
    </el-table-column>
    <!--    <el-table-column v-for="(header,headerIndex) in tableHeader" :key="header"-->
    <!--                     :prop="returnTableProp(headerIndex,tableData)"-->
    <!--                     :label="header"-->
    <!--                     align="center"-->
    <!--    >-->
    <!--    </el-table-column>-->
  </el-table>
  <el-pagination class="pagination" :page-size="7" :total="tableData.length" @current-change="currentPageChange"></el-pagination>
  <edit-product v-show="editProductLogic.isShow" :current-product-data="editProductLogic.currentProductData" @save-edit="saveEdit"></edit-product>
</template>

<script lang="ts">
import {defineComponent, reactive,watchEffect} from "vue";
import {deleteProduct} from "../../../network/request";
import EditProduct from './EditProduct.vue'

export default defineComponent({
  name: "ShopManage",
  props:['tableData'],
  components:{
    EditProduct
  },
  setup(props){
    /**
     * @function editProduct该方法控制这当前所选商品是否编辑
     * @param index 当前行的索引
     * @param rows 当前行的商品数据
     */
   let editProductLogic = reactive({
      isShow:<boolean>false,
      currentProductData:<string[]>[]
    })
    function editProduct(index:number,rows:any[]){
      editProductLogic.isShow = true
      editProductLogic.currentProductData.push( rows[index])
      //console.log(index,rows[index])
    }

    function saveEdit(data:any){
     editProductLogic.isShow = false
     console.log(data)
    }
    /**
     * @function deleteProduct该方法控制这当前所选商品是否删除
     * @param index 当前行的索引
     * @param rows 商品数据
     * 点击对应行中的删除按钮即可删除该行的商品数据
     */
    function deletePro(index:number,rows:any[]){
      //rows.splice(index,1)
      deleteProduct(rows[index].id).then(result =>{
        console.log(result)
      }).catch(err =>{
        console.log(err)
      })
    }

    function selection(val:any){
      console.log(val)
    }

    /**
     * @param currentPageData 存储当前数据变量的对象
     * @param pageData 存储当前需要显示的数据数组
     * @function currentPageChange该方法通过获取到的页码值来控制对应页面需要显示的数据
     */
    let currentPageData = reactive({
      pageData:<any[]>[]
    })

    watchEffect(()=>{
      currentPageData.pageData = sliceTableData(0,7)
    })

    function currentPageChange(val:any){
      if (val===1){
        currentPageData.pageData = sliceTableData(val-1,7)
      }
      else {
        currentPageData.pageData = sliceTableData((val-1)*7,((val-1)*7)+7)
      }
    }

    function sliceTableData(start:number,end:number) {
      return props.tableData.slice(start,end)
    }

    return {
      editProduct,
      editProductLogic,
      saveEdit,
      deletePro,
      selection,
      currentPageChange,
      currentPageData
    }
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
.mall-table{
  margin-top:1rem;
  width: 100%;
  height: 72%;
}
.product-id{
  color: #1e8efc;
}
.title{
  display: block;
  min-width: 200px;
  color: #d91868;
}
.price{
  color: #ff4d00;
}
.table-image{
  padding: .2rem;
  width: 10%;
  min-width: 42px;
  border: 1px solid #bdb6b6;
}
.operation-btn{
  min-width: 200px;
}
.edit-btn,.delete-btn{
  color: #fff;
}
.edit-btn{
  background-color: #1e8efc;
}
.delete-btn{
  background-color: #f00;
}
.pagination{
  margin-top: 1rem;
  height: 3rem;

}
</style>