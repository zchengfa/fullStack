<template>
  <el-table class="mall-table" :data="order.data"  border empty-text="商品数据为空">
    <el-table-column prop="order_id" label="订单编号">
      <template #default="scope">
        <span class="order-id">{{scope.row.order_id}}</span>
      </template>
    </el-table-column>
    <el-table-column label="买家昵称" align="center">
      <template #default="scope">
        <span v-if="scope.row.username" class="username">{{scope.row.username}}</span>
        <span v-else class="title">{{scope.row.account}}</span>
      </template>
    </el-table-column>
    <el-table-column label="订单状态" align="center">
      <template #default="scope">
        <span v-if="scope.row.payment_status===0">待支付</span>
        <span v-else-if="scope.row.payment_status===1">已支付</span>
        <span v-else-if="scope.row.payment_status===2">交易完成</span>
        <span v-else-if="scope.row.payment_status===3">待评价</span>
        <span v-else-if="scope.row.payment_status===4">用户取消支付</span>    
        <span v-else-if="scope.row.payment_status===5">待追评</span>
      </template>
    </el-table-column>
    <el-table-column label="物流状态" align="center">
      <template #default="scope">
        <span v-if="scope.row.payment_status===1">等待卖家发货</span>
        <span v-else-if="scope.row.payment_status===2">等待买家收货</span>
        <span v-else-if="scope.row.payment_status===3">用户已收货</span>
        <span v-else-if="scope.row.payment_status===4 || scope.row.payment_status===0 || scope.row.payment_status===5">无物流状态</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center">
      <template #default="scope">
        <div class="operation-btn">
          <el-button v-if="scope.row.payment_status===1" type="success" class="edit-btn" size="small">发货</el-button>
          <span v-else class="delete-btn" size="small">当前状态无法操作</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
<!--  <el-pagination class="pagination" :page-size="7" :total="tableData.length" @current-change="currentPageChange"></el-pagination>-->
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import { getOrderData } from "../../../network/request";

export default defineComponent( {
  name: "OrderManage",
  setup(){

    let order = reactive({
      data:<string[]>[]
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
          order.data= orderData
          console.log(order.data)
        }
      })
    }
    getOrder()

    return{
      order
    }
  }
})
</script>

<style scoped>
.mall-table{
  margin: 0 auto;
  width: 90%;

}
</style>