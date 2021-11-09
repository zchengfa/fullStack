<template>
  <el-table :data="memberData">
    <el-table-column prop="id"></el-table-column>
    <el-table-column prop="account"></el-table-column>
    <el-table-column prop="username"></el-table-column>
    <el-table-column prop="identity"></el-table-column>
    <el-table-column prop="registerTime"></el-table-column>
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
import {defineComponent,reactive} from "vue";

export default defineComponent({
  name: "MemberManage",
  props:['memberData'],
  setup(props){
    let tabLogic = reactive({
      memberData:<any[]>[],
      tableData:<any[]>[]
    })

    return {
      tabLogic
    }
  }
})
</script>

<style scoped>

</style>