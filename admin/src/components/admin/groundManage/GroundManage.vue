<template>
  <el-row >
    <el-col :span="16" class="filter-row">
      <div class="filter-box">
        <label for="search">搜索：</label>
        <input id="search" type="text" placeholder="请输入搜索条件">
      </div> 
      <div class="filter-button">
        <el-button size="small" @click="groundMany">批量上架</el-button>
        <el-button size="small" @click="underMany">批量下架</el-button>
      </div>   
    </el-col>
  </el-row>
  <el-table :data="table.tableData" border class="table" @selection-change="handleSelection">
  <el-table-column type="selection" width="55" />
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
import { defineComponent, getCurrentInstance,ComponentInternalInstance} from "vue";
import useTable from '../../../common/useTable'
import {groundProduct} from '../../../network/request'

export default defineComponent({
  name:'GroundManage',
  props:['groundData'],
  components:{
    
  },
  setup(props){
    const {appContext} = getCurrentInstance() as ComponentInternalInstance

    const {table,currentPageChange} = useTable(6)

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

    const handleSelection = (val:any)=>{
      console.log(val)
    }

    const groundMany = ()=>{
      appContext.config.globalProperties.$toast.showToast('您选中的商品中含有已上架的商品，无法进行上架操作',3000,'上架提醒：')
    }

    const underMany = ()=>{

    }
  
    return {
      table,
      underPro,
      groundPro,
      currentPageChange,
      handleSelection,
      groundMany,
      underMany
    }
  }
})

</script>

<style scoped>
.filter-row{
  margin-bottom: 2vh;
  min-width: 430px;
  border: 1px solid #d6d4d8;
  text-align: left;
  text-indent: 1rem;
}
.filter-button{
  padding: 2vh;
}
.filter-box{
  padding: 2vh;
}
.filter-button button{
  border: 1px solid purple;
  color: #fff;
  background: #8E2DE2;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #a782f1, #8E2DE2);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #ae8fec, #b574ee); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
#search{
  width: 25%;
  height: 1.6rem;
  border-radius: 1rem;
  text-indent: 1rem;
}
.table{
  width: 100%;
  height:66%;
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