<template>
  <el-table :data="table.tableData" border class="table">
    <el-table-column label="id" prop="product_id"></el-table-column>
    <el-table-column label="描述" prop="product_title" align="center"></el-table-column>
    <el-table-column label="图片" align="center">
      <template #default="scope">
        <img :src="scope.row.product_image" alt="product_image" :title="scope.row.product_title"/>
      </template>
    </el-table-column>
    <el-table-column label="上下架状态" align="center">
      <template #default="scope">
        <span class="grounding shop-status" v-show="scope.row.isGrounding">上架</span>
        <span class="under shop-status" v-show="!scope.row.isGrounding">下架</span>
      </template>
    </el-table-column>
    <el-table-column label="操作"  align="center" >
      <template #default="scope">
        <div class="operation-btn">
          <el-button class="ground-btn" size="small" type="danger" v-show="scope.row.isGrounding" @click.prevent="underPro(scope.row.product_id)">下架</el-button>
          <el-button class="under-btn" size="small" type="primary" v-show="!scope.row.isGrounding" @click.prevent="groundPro(scope.row.product_id)">上架</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="pagination" :page-size="table.pageSize" :total="table.data.length" @current-change="currentPageChange"></el-pagination>
</template>

<script lang="ts">
import { defineComponent, reactive,watchEffect} from "vue";
import useTable from '../../../common/useTable'
import {groundProduct} from '../../../network/request'

export default defineComponent({
  name:'GroundManage',
  props:['groundData'],
  components:{
    
  },
  setup(props){

    const {table,currentPageChange} = useTable(7)

    table.data = props.groundData
    
    const underPro = (id:string)=>{
      groundGoods(id,0)
    }

    const groundPro = (id:string)=>{
      groundGoods(id,1)
    }

    const groundGoods = (id:string,status:number)=>{
      groundProduct({id,status}).then(res=>{
        console.log(res)
      })
    }
  
    return {
      table,
      underPro,
      groundPro,
      currentPageChange
    }
  }
})

</script>

<style scoped>
.table{
  width: 100%;
  height: 75%;
}
.shop-status{
  display: inline-block;
  padding:.1rem .8rem;
  border-radius: .2rem;
  color: #fff;
}
.grounding{
  background-color: rgb(41, 196, 235);
}
.under{
  background-color: rgb(165, 168, 170);
}
img{
  width: 3rem;
}
.pagination{
  margin-top: 2rem;
}
</style>