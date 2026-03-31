<template>
  <div class="stock-manage">
    <div class="header">
      <h2>库存管理</h2>
      <div class="actions">
        <el-input
            v-model="statusLabel.searchConfident"
            placeholder="搜索商品名称、ID或分类"
            @keyup.enter="searchDataByKeyUp"
            class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="searchData(statusLabel.searchConfident,'')">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="refreshTable" :class="{'rotate': stock.isRotate}">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="filter-section">
      <div class="status-filter">
        <span>库存状态：</span>
        <el-button
            v-for="(item, index) in statusLabel.data"
            :key="index"
            :type="item.isChecked ? statusLabel.buttonType[index] : ''"
            @click="showLabelData(item.title, index)"
            :class="{'checked': item.isChecked}"
        >
          {{ item.title }}
        </el-button>
      </div>
      <div class="category-filter">
        <span>商品分类：</span>
        <el-select v-model="stockLogic.categoryCheckOption" placeholder="选择分类" @change="showGoodsByCategory(stockLogic.categoryCheckOption)">
          <el-option
              v-for="item in stockLogic.selectCategoryOptions"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="table.currentPageData" stripe border style="width: 100%" empty-text="没有库存数据">
        <el-table-column prop="id" label="商品ID" width="180"></el-table-column>
        <el-table-column label="商品图片" width="120">
          <template #default="scope">
            <el-image
                :src="scope.row.imagePath"
                fit="cover"
                style="width: 80px; height: 80px"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" min-width="200"></el-table-column>
        <el-table-column prop="category" label="商品分类" width="120"></el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="库存数量" width="120">
          <template #default="scope">
            <el-tag :type="getStockStatusType(scope.row.count)">
              {{ scope.row.count }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editStock(scope.$index, table.currentPageData)">
              编辑库存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <pagination :total="table.tableData ? table.tableData.length : 0" @currentPageChange="currentPageChange"></pagination>
    </div>

    <!-- 编辑库存对话框 -->
    <el-dialog v-model="editDialogVisible.value" title="编辑库存" width="30%">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="商品ID">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="editForm.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="editForm.count" :min="0" :max="9999"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible.value = false">取消</el-button>
                    <el-button type="primary" @click="saveStock">保存</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {getStocksManageData, alterProduct} from "@/network/request";
import {Check, Refresh, Search, Picture} from "@element-plus/icons-vue";
import Pagination from "../../common/Pagination.vue";
import useTable from "../../../common/useTable";
import {ElMessage} from "element-plus";

export default defineComponent( {
  name: "StocksManage",
  components:{
    Search,
    Check,
    Pagination,
    Refresh,
    Picture
  },
  setup(){
    const { table,currentPageChange } = useTable(7)

    let stock = reactive({
      isRotate:false
    })

    interface status {
      title:string,
      isChecked:boolean
    }

    let statusLabel = reactive({
      data:<status[]>[{title:'库存充足',isChecked:false},{title:'库存不足',isChecked:false},{title:'已售罄',isChecked:false}],
      buttonType:<string[]>['success','warning','danger'],
      searchConfident:<string>'',
      showEmptyTip:false
    })

    let stockLogic = reactive({
      selectCategoryOptions:<string[]>[],
      categoryCheckOption:<string>''
    })

    let editDialogVisible = reactive({
      value: false
    })

    let editForm = reactive({
      id: '',
      title: '',
      count: 0,
      index: 0
    })

    //获取库存数据
    const fetchStockData = ()=>{
      getStocksManageData().then(res=>{
        // 清空现有数据
        table.manageData = []
        table.tableData = []
        table.dataCopy = []
        stockLogic.selectCategoryOptions = []

        let stockData = res.data.data['product'] || res.data
        stockData.map((item:any)=>{
          table.manageData.push({
            id:<string>item.product_id,
            title:<string>item.product_title,
            imagePath:<string>item.product_image,
            count:<number>item.stocks,
            price:<string>item.price,
            category:<string>item.product_type
          })

          //获取商品中的分类
          if (stockLogic.selectCategoryOptions.indexOf(item['product_type'])===-1){
            stockLogic.selectCategoryOptions.push(item['product_type'])
          }
        })
        table.tableData.push(...table.manageData)
        table.dataCopy.push(...table.manageData)
      }).catch(err=>{
        console.error('获取库存数据失败:', err)
        ElMessage({
          type:'error',
          message:'获取库存数据失败'
        })
      })
    }

    // 初始化时获取库存数据
    fetchStockData()

    //点击标签显示对应的数据
    const showLabelData = (title:string,index:number)=>{
      statusLabel.data.map((item:{title:string,isChecked:boolean},labelIndex:number)=>{
        if (labelIndex!== index){
          item['isChecked'] = false
        }
      })
      statusLabel.data[index]['isChecked'] = !statusLabel.data[index]['isChecked']

      let stockStatus:number = 0
      switch (title) {
        case '库存充足':
          stockStatus = 1;
          break;
        case '库存不足':
          stockStatus = 2;
          break;
        case '已售罄':
          stockStatus = 0;
          break;
      }
      searchData(stockStatus.toString(),'status')
    }

    //查找库存函数
    const findData = (findArr:any[],searchConfident:string|RegExp,target:string)=>{
      let regExp:RegExp = new RegExp(searchConfident)
      let newData:any[] = []

      if (!searchConfident.toString().length){
        statusLabel.showEmptyTip = true
        ElMessage({
          type:'error',
          message:'请输入搜索条件'
        })
        return null
      }
      else{
        statusLabel.showEmptyTip = false
        findArr.map((item:any)=>{
          if (target==='status'){
            let status = parseInt(searchConfident.toString())
            if (status === 1 && item.count > 10){
              newData.push(item)
            } else if (status === 2 && item.count <= 10 && item.count > 0){
              newData.push(item)
            } else if (status === 0 && item.count === 0){
              newData.push(item)
            }
          }
          else{
            if (regExp.test(item.id) || regExp.test(item.title) || regExp.test(item.category)){
              newData.push(item)
            }
            //清除标签按钮的选中状态
            clearButtonChecked()
          }
        })

        return newData
      }
    }

    //点击搜索按钮搜索库存
    const searchData = (confident:string | RegExp,target:string)=>{
      let regExpArr:any[] | null = findData(table.dataCopy,confident,target)
      if (regExpArr!==null){
        table.manageData = []
        table.tableData = []
        table.manageData.push(...regExpArr)
        table.tableData.push(...regExpArr)
      }
    }

    const searchDataByKeyUp = (e: { keyCode: number; })=>{
      if (e.keyCode===13){
        searchData(statusLabel.searchConfident,'')
      }
    }

    //点击重置按钮，刷新表格显示全部库存数据，重置输入框
    const refreshTable = ()=>{
      stock.isRotate = true
      table.manageData = []
      table.tableData = []
      table.dataCopy = []
      stockLogic.selectCategoryOptions = []
      statusLabel.searchConfident = ''
      stockLogic.categoryCheckOption = ''

      //清除标签按钮的选中状态
      clearButtonChecked()

      // 重新获取库存数据
      fetchStockData()

      let timer = setTimeout(()=>{
        stock.isRotate = false
        clearTimeout(timer)
      },1000)
    }

    const clearButtonChecked = ()=>{
      statusLabel.data.map((item:{isChecked:boolean})=>{
        if (item.isChecked){
          item.isChecked = false
        }
      })
    }

    //按分类筛选商品
    const showGoodsByCategory = (item:string)=>{
      let operationArr:any[] = [],regExpArr:any[] = []
      operationArr.push(...table.dataCopy)

      let regExp:RegExp = new RegExp(item)
      operationArr.map((items:any)=>{
        if (regExp.test(items['category'])){
          regExpArr.push(items)
        }
      })
      table.tableData = regExpArr
    }

    //编辑库存
    const editStock = (index:number,rows:any[])=>{
      editForm.id = rows[index].id
      editForm.title = rows[index].title
      editForm.count = rows[index].count
      editForm.index = index
      editDialogVisible.value = true
    }

    //保存库存修改
    const saveStock = ()=>{
      alterProduct(editForm.id, {stocks: editForm.count}).then(res=>{
        if (res.data.success){
          //更新表格中的数据
          table.currentPageData[editForm.index].count = editForm.count
          //同时更新原始数据
          table.dataCopy.forEach((item:any)=>{
            if (item.id === editForm.id){
              item.count = editForm.count
            }
          })
          ElMessage({
            type:'success',
            message:'库存修改成功'
          })
          editDialogVisible.value = false
        } else {
          ElMessage({
            type:'error',
            message:'库存修改失败'
          })
        }
      }).catch(err=>{
        console.log(err)
        ElMessage({
          type:'error',
          message:'库存修改失败'
        })
      })
    }

    // 获取库存状态类型
    const getStockStatusType = (count:number) => {
      if (count === 0) return 'danger'
      if (count <= 10) return 'warning'
      return 'success'
    }

    return{
      stock,
      statusLabel,
      showLabelData,
      searchData,
      searchDataByKeyUp,
      refreshTable,
      table,
      currentPageChange,
      stockLogic,
      showGoodsByCategory,
      editStock,
      editDialogVisible,
      editForm,
      saveStock,
      getStockStatusType
    }
  }
})
</script>

<style scoped>
.stock-manage {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.status-filter, .category-filter {
  display: flex;
  align-items: center;
}

.status-filter span, .category-filter span {
  margin-right: 10px;
  font-weight: bold;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
}

.rotate {
  animation: rotate 1s linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.checked {
  opacity: 0.7;
}
</style>
