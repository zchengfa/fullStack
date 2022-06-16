<template>
  <el-table :data="currentPageData.pageData" class="member-table" border :header-cell-style="headerStyle" :cell-style="rowStyle" empty-text="用户数据为空">
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
        <el-button class="delete-btn" size="small" @click.prevent="deleteMember(scope.$index,tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="pagination" :page-size="currentPageData.pageSize" :total="tableData.length" @current-change="currentPageChange"></el-pagination>
</template>

<script lang="ts">
import {defineComponent, reactive, watchEffect} from "vue";
import {deleteUser} from "../../../network/request";

export default defineComponent({
  name: "MemberManage",
  props:['tableData'],
  setup(props){
		
		/**
		 *@function headerStyle 自定义设置表头的样式 
		 *@function cellStyle 自定义设置表格行的样式 
		 */
		function headerStyle(){
			return "background:#606bff;color:#fff"
		}
		
		function rowStyle({rowIndex}){
			if(rowIndex%2===0){
				return "background:#dddddd;"
			}
			else{
				return "background:#ffffff;"
			}
		}
		
		function deleteMember(index:any,rows:any){
			//console.log(index,rows[index])
			deleteUser(rows[index].user_id).then(result =>{
				if(result.data.success){
					if(rows.splice(index,1)){
						alert(result.data.success)
					}
					
				}
				//console.log(result)
			}).catch((err:any) =>{
				console.log(err)
			})
		}

    /**
     * @param currentPageData 存储当前数据变量的对象
     * @param pageData 存储当前需要显示的数据数组
     * @function currentPageChange该方法通过获取到的页码值来控制对应页面需要显示的数据
     */
    let currentPageData = reactive({
      pageData:<any[]>[],
      pageSize:<number>10
    })

    watchEffect(()=>{
      currentPageData.pageData = sliceTableData(0,currentPageData.pageSize)
    })

    function currentPageChange(val:any){
      if (val===1){
        currentPageData.pageData = sliceTableData(val-1,currentPageData.pageSize)
      }
      else {
        currentPageData.pageData = sliceTableData((val-1)*currentPageData.pageSize,((val-1)*currentPageData.pageSize)+currentPageData.pageSize)
      }
    }

    function sliceTableData(start:number,end:number) {
      return props.tableData.slice(start,end)
    }
		
    return {
			headerStyle,
			rowStyle,
			deleteMember,
      currentPageChange,
      currentPageData
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