<template>
  <el-container>
    <el-header>{{welcome.title}}</el-header>
    <el-main>main</el-main>
    <el-footer>footer</el-footer>
  </el-container>
</template>

<script lang="ts">
import {reactive,defineComponent} from "vue";
import {useRouter} from 'vue-router'
import {ElContainer,ElHeader,ElMain,ElFooter} from "element-plus";

export default defineComponent({
  name: "admin",
  components:{
    ElContainer,ElHeader,ElFooter,ElMain
  },
  setup(){
    const router = useRouter()
    let welcome = reactive({
      title:"欢迎来到mall管理平台"
    })

    //检查管理员是否登录
    function checkUserIsLogin(){
      //获取token，如果存在token则说明管理员已经登录，可以进入管理页面，反之则引导管理员进入登录界面
      const token:string = sessionStorage.getItem('token')
      if (token){
        router.push('/')
      }
      else{
        router.push('/login')
      }
    }
    let checkIsLogin:any = checkUserIsLogin()


    return {
      welcome,
      checkIsLogin
    }
  }

})

</script>

<style scoped>

</style>
