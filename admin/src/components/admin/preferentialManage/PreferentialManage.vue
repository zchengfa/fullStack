<script setup lang="ts">
import { getPreferential,releasePreferential } from '../../../network/request'
import Pagination from "../../common/Pagination.vue";
import Preferential from "../../common/Preferential.vue";
import useTable from "../../../common/useTable";
import {DeleteFilled, Edit, Goods} from "@element-plus/icons-vue";
import {ElMessage, ElIcon} from "element-plus";
import { ref } from 'vue'


const { table,currentPageChange } = useTable(6)
function preferential(){
    getPreferential().then(res=>{

        if(res.status === 200){
            let data = res.data.query
            data.forEach((item:any)=>{
                //给每个item添加单独的处理switch的函数
                item['release_status'] = Boolean(item['release_status'])
                item.switchChange = ()=>{
                    return new Promise(resolve => {
                        releasePreferential(!item['release_status'],item.id).then((result)=>{
                            //消息提示
                            ElMessage({
                                message:result.data.msg,
                                type:'success'
                            })
                            resolve(true)
                        })
                    })
                }
            })
            table.manageData = data
            table.tableData = data

        }
    })
}

preferential()

let selection = ref([])

/**
 * 获取所有数据中含有的选择项数组
 * @param data { Array } 所有数据
 * @param name { string } 判断属性
 * @return { Array } 返回选择项数组
 */
let selectOptions = (data:any[],name:string) => {
    let options:Array<string> = []
    data.forEach((item:any)=>{
        if(options.indexOf(item[name]) === -1){
            options.push(item[name])
        }
    })

    return options
}

/**
 * 点击选择项筛选对应数据
 * @param item { string } 选择的选项
 */
let filterOption = (item:string)=>{
    let operationArr:string[] = [],regExpArr:string[] = []
    operationArr.push(...table.manageData)

    let regExp:RegExp = new RegExp(item)

    operationArr.map((items:any)=>{
        if (regExp.test(items['type'])){
            regExpArr.push(items)
        }
    })
    table.tableData = regExpArr
}

let editPreferential = (index:number,data:any[])=> {

}

let deletePreferential = (index:number,data:any[])=> {

}


</script>

<template>
  <el-row class="padding-box filter-box">
    <el-button type="warning" size="small" class="add-preferential">添加优惠券</el-button>
    <div class="category-container">
      <div class="category-selector-box">
        <span>优惠券名称：</span>
        <el-input  placeholder="请输入优惠券名称"></el-input>
      </div>
      <div class="category-selector-box">
        <span>优惠券类型：</span>
        <el-select placeholder="全部" class="select" v-model="selection">
          <el-option  v-for="item in selectOptions(table.manageData,'type')" @click="filterOption(item)" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </div>
      <el-button type="success" size="small" class="search">搜索</el-button>
      <el-button type="danger" size="small" class="reset">重置</el-button>
    </div>
  </el-row>
  <el-row>
      <el-table :data="table.currentPageData" border class="table mall-table">

          <el-table-column label="id" prop="id" align="center"></el-table-column>
          <el-table-column label="优惠券名称" align="center">
              <template #default="scope">
                  <Preferential class="preferential-com" :threshold="<string>scope.row['name']"></Preferential>
              </template>
          </el-table-column>
          <el-table-column label="优惠类型" align="center">
              <template #default="scope">
                  <span style="padding: 10px;background-color: red;color: #fff;font-size: 12px;">{{scope.row['type']}}</span>
              </template>
          </el-table-column>
          <el-table-column label="消费门槛" align="center">
              <template #default="scope">
                  <span>{{scope.row['use_threshold']}}元</span>
              </template>
          </el-table-column>
          <el-table-column label="使用期限" align="center">
              <template #default="scope">
                  <span>领取{{scope.row['expiration_time']}}天后过期</span>
              </template>
          </el-table-column>
          <el-table-column label="是否发布" align="center">
              <template #default="scope">
                  <span v-if="scope.row['release_status']" style="padding: 10px;background-color: #99bde0;color: #fff;font-size: 12px;border-radius: 14px">已发布</span>
                  <span v-else style="padding: 10px;background-color: #acaeb0;color: #fff;font-size: 12px;border-radius: 14px">未发布</span>
              </template>
          </el-table-column>
          <el-table-column label="库存量" align="center">
              <template #default="scope">
                  <span>{{scope.row['stock']}}张</span>
              </template>
          </el-table-column>
          <el-table-column label="发布开关" align="center">
              <template #default="scope">
                  <el-switch :before-change="scope.row['switchChange']" v-model="scope.row['release_status']"  style="--el-switch-on-color: #13ce66;"/>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
              <template #default="scope">
                  <div class="operation-btn">
                      <el-button type="primary" class="edit-btn" size="small" @click.prevent="editPreferential(scope.$index,table.currentPageData)"  v-permission="{permission:'edit',effect:'disabled'}">
                          <el-icon class="menu-title-icon"><Edit></Edit></el-icon>
                      </el-button>
                      <el-button type="danger" class="edit-btn" size="small" @click.prevent="deletePreferential(scope.$index,table.currentPageData)" v-permission="{permission:'edit',effect:'disabled'}">
                          <el-icon class="menu-title-icon"><DeleteFilled /></el-icon>
                      </el-button>
                  </div>
              </template>
          </el-table-column>

      </el-table>
      <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>
  </el-row>
</template>

<style scoped>
.preferential-com{
    width: 100px;
    height: 60px;
}
.padding-box{
  padding: 10px;
  border: 1px solid #d7d4d4;
}
.filter-box{
  display: flex;
  flex-direction: column;
}
.add-preferential{
  width: 100px;
}
.category-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0;
}
.category-selector-box{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 10px 10px 0;
}
.category-selector-box span{
    min-width: 100px;
    font-size: 14px;
}

</style>