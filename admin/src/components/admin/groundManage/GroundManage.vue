<template>
  <el-row >
    <el-col :span="16" class="filter-row">
      <div class="filter-box">
        <label for="search">搜索：</label>
        <input id="search" v-model="groundingUnder.searchKeyword" type="text" placeholder="请输入搜索条件" @keyup="searchGrounding($event)">
      </div> 
      <div class="filter-button">
        <el-button size="small" @click="groundUnderMany('上架',1)">批量上架</el-button>
        <el-button size="small" @click="groundUnderMany('下架',0)">批量下架</el-button>
      </div>   
    </el-col>
  </el-row>
  <el-table :data="table.currentPageData" border class="table mall-table" @selection-change="handleSelection">
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
          <span class="grounding shop-status" v-show="scope.row.isGrounding">已上架</span>
          <span class="under shop-status" v-show="!scope.row.isGrounding">已下架</span>
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
  <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, ComponentInternalInstance, reactive,nextTick, toRaw} from "vue";
import useTable from '../../../common/useTable'
import {groundProduct} from '../../../network/request'
import Pagination from "../../common/Pagination.vue";
import { shopStore } from "../../../pinia/pinia";

export default defineComponent({
  name:'GroundManage',
  components:{
    Pagination

  },
  setup(props){
    const {appContext} = getCurrentInstance() as ComponentInternalInstance

    const {table,currentPageChange,search} = useTable(6)
    const { data } = shopStore()
    table.manageData = data
    table.tableData = data
    // table.manageData = props.groundData
    // table.dataCopy = props.groundData
    

    let groundingUnder = reactive({
      selection:<string[]>[],
      searchKeyword:<any>''
    })
    
    const underPro = (id:string)=>{
      groundUnderGoods(id,0,'下架成功')
    }

    const groundPro = (id:string)=>{
      groundUnderGoods(id,1,'上架成功')
    }

    const groundUnderGoods = (id:string | string[],status:number,response:string)=>{
      groundProduct({id,status}).then(res=>{
        console.log(res)
        res.data.grounding_result?(()=>{
          //获得反馈后弹出提示框，并更新表中的数据
          appContext.config.globalProperties.$toast.showToast(response,3000,'结果：')
          nextTick(()=>{
            if (Array.isArray(id)){
              table.tableData.map((item:any)=>{
                id.map((idItem:string)=>{
                  if (item.product_id===idItem){
                    item.isGrounding = status
                  }
                })
              })
            }
            else{
              table.tableData.map((item:any)=>{
                if (item.product_id===id){
                  item.isGrounding = status
                }
              })
            }
          })

        })():null
      })
    }

    const handleSelection = (val:string[])=>{
      groundingUnder.selection = val
    }

    const groundUnderMany = (operation:string,confident:number)=>{
      let selectionData = groundingUnder.selection
      !selectionData.length?appContext.config.globalProperties.$toast.showToast(`您未选中任何商品，无法进行${operation}操作`,3000,`${operation}提醒：`):null
      selectionData.length?(()=>{
        let selectPro:string[] = [],hadGroundUnderCount:number = 0
        selectionData.map((item:any)=>{
          item.isGrounding===confident?hadGroundUnderCount++:null

          hadGroundUnderCount?appContext.config.globalProperties.$toast.showToast(`您选中的商品中含有已${operation}的商品，无法进行${operation}操作，请取消勾选已${operation}的商品`,3000,`${operation}提醒：`)
              :(()=>{
                selectPro.push(item.product_id)
              })()

          selectPro.length===selectionData.length?(()=>{
            groundUnderGoods(selectPro,confident,`商品批量${operation}成功`)
          })():null
        })

      })():null
    }

    const searchGrounding = (e:any)=>{
      if (e.keyCode===13){
        if(groundingUnder.searchKeyword==='已上架' || groundingUnder.searchKeyword==='上架'){
          let arr = returnGrounding(table.dataCopy,1)
          table.manageData = arr
        }
        else if(groundingUnder.searchKeyword==='已下架' || groundingUnder.searchKeyword==='下架'){
          let arr = returnGrounding(table.dataCopy,0)
          table.manageData = arr
        }
        else{
          let arr = search(table.manageData,table.tableData,groundingUnder.searchKeyword,e.keyCode,['product_title','product_id','isGrounding'])
          table.tableData = arr
          table.manageData = arr
        if (!groundingUnder.searchKeyword.length){
          table.manageData = table.tableData
        }
        }

        function returnGrounding(data:any[],grounding:number){
          let groundingArr:any[] = []
          data.map((item:any)=>{
            if(item.isGrounding===grounding){
              groundingArr.push(item)
            }
          })
          return groundingArr
        }
      }
    }
  
    return {
      table,
      groundingUnder,
      underPro,
      groundPro,
      currentPageChange,
      handleSelection,
      groundUnderMany,
      searchGrounding
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
  width: 30%;
  height: 1.6rem;
  border-radius: 1rem;
  text-indent: 1rem;
  border: 1px solid #8b8a8d;
}
#search:focus{
  outline: 1px solid #e494d2;
}
.table{
  width: 100%;

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
  width: 60%;
}
</style>