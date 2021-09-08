<template>
  <el-row>
    <el-col :span="6">
      <el-form

          status-icon

          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input
              type="password"

              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
              type="password"

              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >提交</el-button>
          <el-button >重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import {reactive} from "vue";
import {ElButton,ElForm,ElInput,ElRow,ElCol} from 'element-plus'

export default {
  name: "login",
  components:{
    ElButton,
    ElForm,
    ElInput,
    ElRow,
    ElCol
  },
  setup(){
    const data = reactive({
      message:'vite'
    })
    return {
      data
    }
  }
}
</script>

<style scoped>
.el-row{
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}
.el-col{
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>