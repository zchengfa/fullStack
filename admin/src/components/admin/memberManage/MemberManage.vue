<template>
  <el-table :data="table.currentPageData" class="member-table mall-table" max-height="450"   border :header-cell-style="headerStyle" :cell-style="rowStyle" empty-text="用户数据为空">
    <el-table-column prop="user_id" label="用户ID" align="center">
		<template #default="scope">
			<span class="user-id">{{scope.row.user_id}}</span>
		</template>
	</el-table-column>
    <el-table-column prop="account" label="账号" align="center"></el-table-column>
    <el-table-column prop="username" label="用户昵称" align="center"></el-table-column>
    <el-table-column prop="identity" label="身份" align="center"></el-table-column>
    <el-table-column prop="register_time" label="注册时间" align="center">
			<template #default="scope">
				<span class="register-time">{{scope.row.register_time}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="last_login_time" label="最近登录时间" align="center">
			<template #default="scope">
				<span class="last-login-time">{{scope.row.last_login_time}}</span>
			</template>
		</el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button class="delete-btn" size="small" @click.prevent="deleteMember(scope.$index,table.tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive, watchEffect} from "vue";
import useTable from "../../../common/useTable";
import {deleteUser, getMemberManageData} from "../../../network/request";
import Pagination from "../../common/Pagination.vue";
import { timeFormatting } from '../../../common/utils'

export default defineComponent({
  name: "MemberManage",
  components: {Pagination},
  setup(){
    const {table,currentPageChange,search} = useTable(6)
		/**
		 *@function headerStyle 自定义设置表头的样式
		 *@function cellStyle 自定义设置表格行的样式
		 */
		function headerStyle(){
      return {
        backgroundColor:"#606bff",
        color:"#fff"
      }
		}

		function rowStyle({rowIndex}:{rowIndex:number}){
			if(rowIndex%2===0){
				return {
          background:"#dddddd"
        }
			}
			else{
				return {
          background: '#fff'
        }
			}
		}

		function deleteMember(index:any,rows:any){

			deleteUser(rows[index].user_id).then(result =>{
				if(result.data.success){
					if(rows.splice(index,1)){
						alert(result.data.success)
					}

				}

			}).catch((err:any) =>{
				console.log(err)
			})
		}

    function getMMData(){
      getMemberManageData().then(result => {
        table.manageData = result.data
        table.manageData.filter(item => {

          !item.username?item.username = '暂未设置昵称': item.username
          !item.last_login_time?item.last_login_time = '暂未登录过': item.last_login_time
          item.last_login_time = timeFormatting(new Date(item.last_login_time))
          switch (item.identity){
            case 0:
              item.identity = '普通用户';
              break;
            case 999:
              item.identity = '客服';
              break;
            case 1000:
              item.identity = 'VIP';
              break;
            default:
              item.identity = '未知身份'
          }
        })
        table.tableData = table.manageData
        //console.log(result.data)
      }).catch(err =>{
        console.log(err)
      })
    }

    onBeforeMount(()=>{
      getMMData()
    })

    return {
			headerStyle,
			rowStyle,
			deleteMember,
      table,currentPageChange,search
    }
  }
})
</script>

<style scoped>
.member-table{
  margin: 1rem auto;
  width: 100%;
	height: 70%;
}
.user-id{
	font-weight: bolder;
	color: #ff5500;
}
.register-time{
	font-weight: bold;
	color: #55007f;
}
.last-login-time{
	font-weight: bold;
	color: #ff5500;
}
.delete-btn{
  position: relative;
  left: 50%;
	background-color: #ff0000;
	color: #fff;
  transform: translateX(-50%);
}
.pagination{
  margin: 0 auto;
  width: 60%;
}
</style>
