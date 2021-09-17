<template>
  <div>{{message.msg}}</div>
</template>

<script>
import {reactive} from "vue";
import router from "../router";

export default {
  name: "admin",
  setup(){
    let message = reactive({
      msg:"我是管理页面"
    })
    //检查管理员是否登录
    function checkUserIsLogin(){
      //获取token，如果存在token则说明管理员已经登录，可以进入管理页面，反之则引导管理员进入登录界面
      const token = sessionStorage.getItem('token')
      if (token){
        router.push('/')
      }
      else{
        router.push('/login')
      }
    }
    let checkIsLogin = checkUserIsLogin()
    return {
      message,
      checkIsLogin
    }
  }

}

</script>

<style scoped>

</style>