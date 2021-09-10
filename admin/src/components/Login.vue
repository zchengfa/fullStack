<template>
  <el-row>
    <el-col :span="6">
      <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input
              type="text"
              v-model="ruleForm.account"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginAdministrator('ruleForm',ruleForm.account,ruleForm.pass)">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import {ElButton,ElForm,ElInput,ElRow,ElCol,ElFormItem} from 'element-plus'
import {loginAdministrator} from "../network/requestLogin";
import {encrypt} from "../common/crypt";

export default {
  name: "login",
  components:{
    ElButton,
    ElForm,
    ElInput,
    ElRow,
    ElCol,
    ElFormItem
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.pass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validateAccount = (rule, value, callback) => {

      //设置账号验证规则
        let RegExpPhone = /^((13[0-9])|(15[^4])|(18[^4])|(199))\d{8}/
        let RegExpMail = /^[1-9]\d{7,10}@qq\.com/

      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (RegExpMail.test(value) === false && RegExpPhone.test(value) === false) {
        callback(new Error('账号格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        account: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        account: [{ validator: validateAccount, trigger: 'blur' }]
      },
    }
  },
  methods: {
    //管理员登录
    loginAdministrator(formName,account,password){
      //点击登录按钮，对表单进行验证，验证通过才能向后台发起登录请求
      this.$refs[formName].validate((valid) => {
        if (valid) {
          loginAdministrator(account,encrypt(password)).then(result => {
            console.log(result)
          }).catch(err => {
            console.log(err)
          })
        }
        else {
          console.log('err submit')
          return false
        }
      })
    }
  },
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