<template>
  <el-container class="mall-login-container">
    <el-header class="mall-login-header">mall商城管理平台</el-header>
    <el-main class="mall-login-main">
      <el-row class="mall-login-content">
        <el-col :span="6" class="content-col">
          <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              class="demo-ruleForm content-form"
          >
            <el-form-item label="账号" prop="account" class="form-item">
              <el-input
                  type="text"
                  v-model="ruleForm.account"
                  autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass" class="form-item">
              <el-input
                  type="password"
                  v-model="ruleForm.pass"
                  autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button type="primary" @click="loginAdministrator('ruleForm',ruleForm.account,ruleForm.pass)">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="mall-login-footer">
      <el-row class="footer-row">
        <el-col :span="10">版权所有 佛山市海天调味食品股份有限公司 公司地址：广东省佛山市文沙路16号</el-col>
      </el-row>
      <el-row class="footer-row">
        <el-col :span="10">
          电话：400-8xxx-813 07x7-828rexx | 粤ICP备12054983号 | <a href="javascript:void (0)">粤公网安备44060402rexx号</a>
        </el-col>
      </el-row>
      </el-footer>
  </el-container>
</template>

<script lang="ts">

import {encrypt} from "../common/crypt";
import {defineComponent} from "vue";

export default defineComponent( {
  name: "login",
  components:{

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
            //登录成功进入管理页面
            if (result.data['success']){

              //将token储存在sessionStorage中
              sessionStorage.setItem('token',result.data['token'])
              this.$router.push('/')
            }
            else {
              alert(result.data['failed'])
            }
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
})
</script>

<style scoped>
.mall-login-container{
  margin: 0 auto;
}
.mall-login-header{
  width: 100%;
  height: 14vh;
  line-height: 14vh;
  text-align: left;
  text-indent: 16vw;
  font-size: larger;
  font-weight: bolder;
}
.mall-login-main{
  width: 100%;
  height: 54vh;
  background-image: url("../assets/image/login/background.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.mall-login-content{
  width: 100%;
}
.content-col{
  margin-left: 60%;
  min-width: 22rem;
  background-color: #fff;
}
.content-form{
  width: 100%;
  height: 100%;
}
.form-item{
  margin: 10% auto;
  width: 90%;
}
.footer-row .el-col{
  margin: 8vh auto 0;
}
</style>