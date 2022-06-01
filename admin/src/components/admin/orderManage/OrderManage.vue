<template>
  <div class="search-box">
    <div>
      <span>订单搜索：</span>
      <el-input placeholder="请输入订单编号、买家昵称、订单状态" v-model="statusLabel.searchConfident" @keyup="searchDataByKeyUp($event)" class="search-input"></el-input>
      <el-button @click="searchData(statusLabel.searchConfident,'')">搜索</el-button>
      <span v-show="statusLabel.showEmptyTip" class="empty-tip">请输入搜索条件</span>
      <el-button size="small" class="refresh-button" @click="refreshTable"><el-icon class="refresh" :class="{'rotate-icon':order.isRotate}"><refresh></refresh></el-icon>重置</el-button>
    </div>
    <div class="search-for-label">
      <span>标签查询：</span>
      <el-button size="small" v-for="(label,index) in statusLabel.data" :type="statusLabel.buttonType[index]" @click="showLabelData(label['title'],index)" :key="index">{{label['title']}}<span v-show="label['isChecked']">√</span></el-button>
    </div>
  </div>
  <el-table class="mall-table" :data="order.data"  border empty-text="商品数据为空" :key="order.tableKey">
    <el-table-column prop="order_id" label="订单编号">
      <template #default="scope">
        <span class="order-id">{{scope.row.order_id}}</span>
      </template>
    </el-table-column>
    <el-table-column label="买家昵称" align="center">
      <template #default="scope">
        <span v-if="scope.row.username" class="username">{{scope.row.username}}</span>
        <span v-else class="account">{{scope.row.account.replace(/(\d{3})\d*(\d{4})/,'$1*****$2')}}</span>
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
  <el-pagination class="pagination" :page-size="order.pageSize" :total="order.tableData.length" @current-change="currentPageChange"></el-pagination>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, reactive, watchEffect} from "vue";
import { getOrderData } from "../../../network/request";
import {Refresh} from "@element-plus/icons-vue";

export default defineComponent( {
  name: "OrderManage",
  components:{
    Refresh
  },
  setup(){
    let order = reactive({
      data:<string[]>[],
      tableData:<string[]>[],
      allData:<string[]>[],
      pageSize:<number>8,
      tableKey:0,
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
        let orderData = res.data['order'],info = res.data['user_info']
        if (orderData&&info){
          orderData.map((o:any)=>{
            info.map((i:any)=>{
              if (o['user_id']===i['user_id']){
                o['account'] = i['account']
                o['username'] = i['username']
              }
            })
          })
          order.data.push(...orderData)
          order.tableData.push(...orderData)
          order.allData.push(...orderData)
        }
      })
    }
    getOrder()

    const currentPageChange = (val:number)=>{
      if (val===1){
        order.data = sliceTableData(val-1,order.pageSize)
      }
      else {
        order.data = sliceTableData((val-1)*order.pageSize,((val-1)*order.pageSize)+order.pageSize)
      }
    }

    const sliceTableData = (start:number,end:number)=>{
      return order.tableData.slice(start,end)
    }

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

      let regExpArr:string[] | null = findData(order.allData,confident,target)
      if (regExpArr!==null){
        order.data = []
        order.tableData = []
        order.data.push(...regExpArr)
        order.tableData.push(...regExpArr)
        order.tableKey++
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
      order.data = []
      order.tableData = []
      order.data.push(...order.allData)
      order.tableData.push(...order.allData)
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

    onMounted(()=>{
      watchEffect(()=>{
        order.data = sliceTableData(0,order.pageSize)
      })
    })

    return{
      order,
      currentPageChange,
      statusLabel,
      showLabelData,
      searchData,
      searchDataByKeyUp,
      refreshTable
    }
  }
})
</script>

<style scoped>

.mall-table,.search-box{
  margin: 0 auto;
  width: 90%;
}
.mall-table{
  height: 55vh;
}
.search-box{
  margin: 0 auto 5vh;
  text-align: left;
  border: 1px solid #eee7e7;
  font-size: 14px;
  font-weight: bold;
}
.search-input{
  margin-left: 0;
  width: 40%;
}
.empty-tip{
  margin-left: 1rem;
  color: #ee4444;
  font-weight: normal;
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
.refresh{
  position: relative;
  top: 1px;
  padding-right: .2rem;
}
.refresh-button{
  margin-left: 1rem;
}
.rotate-icon{
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