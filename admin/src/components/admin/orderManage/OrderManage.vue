<template>
  <div class="search-box">
    <div>
      <span>订单搜索：</span>
      <el-input :placeholder="!statusLabel.showEmptyTip ? '请输入订单编号、买家昵称、订单状态' :'请输入搜索条件' " v-model="statusLabel.searchConfident" @keyup="searchDataByKeyUp($event)" class="search-input"></el-input>
      <el-button size="small" type="success" @click="searchData(statusLabel.searchConfident,'')"><el-icon class="search"><Search></Search></el-icon>搜索</el-button>
<!--      <span v-show="statusLabel.showEmptyTip" class="empty-tip">请输入搜索条件</span>-->
      <el-button size="small" type="danger" class="refresh-button" @click="refreshTable"><el-icon class="refresh" :class="{'rotate-icon':order.isRotate}"><refresh></refresh></el-icon>重置</el-button>
    </div>
    <div class="search-for-label">
      <span>标签查询：</span>
      <el-button size="small" v-for="(label,index) in statusLabel.data" :type="statusLabel.buttonType[index]" @click="showLabelData(label['title'],index)" :key="index">
          <template #default>
              <div  class="label-btn">
                  <span>{{label['title']}}</span>
                  <el-icon class="check-icon" v-show="label['isChecked']"><Check /></el-icon>
              </div>
          </template>
      </el-button>
    </div>
  </div>
  <el-table class="mall-table" :data="table.currentPageData" max-height="450"  border empty-text="暂无订单数据">
    <el-table-column prop="order_id" label="订单编号">
      <template #default="scope">
        <span class="order-id">{{scope.row.order_id}}</span>
      </template>
    </el-table-column>
    <el-table-column label="买家昵称" align="center">
      <template #default="scope">
        <span v-if="scope.row.user.username" class="username">{{scope.row.user.username}}</span>
        <span v-else class="account">{{scope.row.user.account.replace(/(\d{3})\d*(\d{4})/,'$1*****$2')}}</span>
      </template>
    </el-table-column>
    <el-table-column label="订单状态" align="center">
      <template #default="scope">
        <span class="order-status" v-if="scope.row.payment_status===0">待支付</span>
        <span class="order-status" v-else-if="scope.row.payment_status===1">已支付</span>
        <span class="order-status" v-else-if="scope.row.payment_status===2">等待签收</span>
        <span class="order-status" v-else-if="scope.row.payment_status===3">待评价</span>
        <span class="order-status" v-else-if="scope.row.payment_status===4">用户取消支付</span>
        <span class="order-status" v-else-if="scope.row.payment_status===5">待追评</span>
      </template>
    </el-table-column>
    <el-table-column label="物流状态" align="center">
      <template #default="scope">
        <span class="status wait-send" v-if="scope.row.payment_status===1">等待卖家发货</span>
        <span class="status wait-receive" v-else-if="scope.row.payment_status===2">等待买家收货</span>
        <span class="status had-receive" v-else-if="scope.row.payment_status===3">买家已收货</span>
        <span class="status no-status" v-else-if="scope.row.payment_status===4 || scope.row.payment_status===0 || scope.row.payment_status===5">无物流状态</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center">
      <template #default="scope">
        <div class="operation-btn">
          <el-button v-if="scope.row.payment_status===1" type="danger" class="edit-btn" size="small">发货</el-button>
          <el-button v-else class="delete-btn" type="info" size="small">无法操作</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, reactive, watchEffect} from "vue";
import { getOrderData } from "../../../network/request";
import {Check, Refresh, Search} from "@element-plus/icons-vue";
import Pagination from "../../common/Pagination.vue";
import useTable from "../../../common/useTable";
import {ElMessage} from "element-plus";

export default defineComponent( {
  name: "OrderManage",
  components:{
      Search,
      Check,
    Pagination,
    Refresh
  },
  setup(){
    const { table,currentPageChange } = useTable(8)

    let order = reactive({
      isRotate:false
    })
    interface status {
      title:string,
      isChecked:boolean
    }

    let statusLabel = reactive({
      data:<status[]>[{title:'待支付',isChecked:false},{title:'已支付',isChecked:false},{title:'待签收',isChecked:false},{title:'取消支付',isChecked:false},{title:'待评价',isChecked:false},{title:'待追评',isChecked:false}],
      buttonType:<string[]>['primary','success','danger','info','warning','success'],
      searchConfident:<string>'',
      showEmptyTip:false
    })

    const getOrder = ()=>{
      getOrderData().then(res=>{
        let orderData = res.data.data['order']
          table.tableData.push(...orderData)
          table.manageData.push(...orderData)
          table.dataCopy.push(...orderData)

      })
    }
    getOrder()

    //点击标签显示对应的数据
    const showLabelData = (title:string,index:number)=>{
      statusLabel.data.map((item:{title:string,isChecked:boolean},labelIndex:number)=>{
        if (labelIndex!== index){
          item['isChecked'] = false
        }
      })
      statusLabel.data[index]['isChecked'] = !statusLabel.data[index]['isChecked']

      let payment_status:number = 0
      switch (title) {
        case '待支付':
          payment_status = 0;
          break;
        case '已支付':
          payment_status = 1
          break;
        case '待签收':
          payment_status = 2;
          break;
        case '取消支付':
          payment_status = 4
          break;
        case '待评价':
          payment_status = 3;
          break;
        case '待追评':
          payment_status = 5
          break;
      }
      searchData(payment_status.toString(),'status')
    }

    //查找订单函数
    const findData = (findArr:string[],searchConfident:string|RegExp,target:string)=>{
      let regExp:RegExp = new RegExp(searchConfident)
      let newData:string[] = []

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
            if (regExp.test(item.payment_status)){
              newData.push(item)
            }
          }
          else{
            if (regExp.test(item.order_id) || regExp.test(item.account) || regExp.test(item.username)){
              newData.push(item)
            }
            //清除标签按钮的选中状态
            clearButtonChecked()
          }
        })

        return newData
      }
    }

    //点击搜索按钮搜索订单
    const searchData = (confident:string | RegExp,target:string)=>{

      let regExpArr:string[] | null = findData(table.dataCopy,confident,target)
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

    //点击重置按钮，刷新表格显示全部订单数据，重置输入框
    const refreshTable = ()=>{
      order.isRotate = true
      table.manageData = []
      table.tableData = []
      table.manageData.push(...table.dataCopy)
      table.tableData.push(...table.dataCopy)
      statusLabel.searchConfident = ''

      //清除标签按钮的选中状态
      clearButtonChecked()

      let timer = setTimeout(()=>{
        order.isRotate = false
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

    return{
      order,
      statusLabel,
      showLabelData,
      searchData,
      searchDataByKeyUp,
      refreshTable,
      table,currentPageChange
    }
  }
})
</script>

<style scoped>
.search-box .label-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;

}
.check-icon{
    font-size: 12px;

}
.mall-table,.search-box{
  margin: 0 auto;
  width: 90%;
}
.mall-table{
  height: 55vh !important;
}
.search-box{
  margin: 20px auto;
  text-align: left;
  border: 1px solid #eee7e7;
  font-size: 14px;
  font-weight: bold;
}
.search-input{
  margin-left: 0;
  width: 40%;
}

.search-box div{
  margin: 1rem;
}
.order-id{
  color: #ee4411;
}
.username,.account{
  color: #8a8686;
}
.order-status{
  display: inline-block;
  padding: 0 1rem;
  border: 1px solid #ded7d7;
  font-size: 12px;
  color: #8a8686;
}
.status{
  position: relative;
  padding:0 .5rem;
  display: inline-block;
  font-size: 12px;
  color: #fff;
  z-index: 1;
}
.status::before,.status::after{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  content: '';
  z-index: -1;
}
.status.wait-send::before,
.status.wait-send::after{
  background-color: #f30d0d;
}
.status.wait-receive::before,
.status.wait-receive::after{
  background-color: #c54ce7;
}
.status.had-receive::before,
.status.had-receive::after{
  background-color: #45e80e;
}
.status.no-status::before,
.status.no-status::after{
  background-color: #9a9494;
}
.status::before{
  transform: skew(45deg);
}
.status::after{
  transform: skew(-45deg);
}
.pagination{
  position: relative;
  margin: 2vh 50%;
  width: 60%;
  transform: translateX(-50%);
}
.refresh,.search{
  position: relative;
  padding-right: .2rem;
  font-size: 12px;
}
.refresh-button{
  margin-left: 1rem;
}
.rotate-icon{
    transform-origin: 50% 50%;
  animation: rotateIcon 1s linear;
}
@keyframes rotateIcon {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
