<template>
  <el-table :data="memberData" class="member-table" border :header-cell-style="headerStyle" :cell-style="rowStyle" empty-text="用户数据为空">
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
    <el-table-column label="操作" fixed="right" align="center">
      <template #default="scope">
        <div class="operation-btn">
          <el-button class="delete-btn" size="small" @click.prevent="deleteMember(scope.$index,memberData)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {deleteUser} from "../../../network/request.ts"

export default defineComponent({
  name: "MemberManage",
  props:['memberData'],
  setup(){
		
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
		
		function deleteMember(index,rows){
			//console.log(index,rows[index])
			deleteUser(rows[index].user_id).then(result =>{
				if(result.data.success){
					if(rows.splice(index,1)){
						alert(result.data.success)
					}
					
				}
				//console.log(result)
			}).catch(err =>{
				console.log(err)
			})
		}
		
    return {
			headerStyle,
			rowStyle,
			deleteMember
    }
  }
})
</script>

<style scoped>
.member-table{
  margin: 1rem auto;
  width: 98%;
	
}
.user-id{
	font-weight: bolder;
	color: #ff5500;
}
.register-time{
	font-weight: bold;
	color: #55007f;
}
.delete-btn{
	background-color: #ff0000;
	color: #fff;
}

</style>