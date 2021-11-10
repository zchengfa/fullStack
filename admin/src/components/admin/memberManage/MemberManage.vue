<template>
  <el-table :data="memberData" border class="member-table">
    <el-table-column prop="user_id" label="用户ID" align="center"></el-table-column>
    <el-table-column prop="account" label="账号" align="center"></el-table-column>
    <el-table-column prop="username" label="用户昵称" align="center"></el-table-column>
    <el-table-column prop="identity" label="身份" align="center"></el-table-column>
    <el-table-column prop="register_time" label="注册时间" align="center"></el-table-column>
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

export default defineComponent({
  name: "MemberManage",
  props:['memberData'],
  setup(){
    return {

    }
  }
})
</script>

<style scoped>
.member-table{
  margin: 1rem auto;
  width: 90%;
}
</style>