<template>
  <el-container>
    <el-header class="admin-header">{{welcome.title}}</el-header>
    <el-main class="admin-main">
      <el-tabs tab-position="left" class="left-tabs">
        <el-tab-pane v-for="(item,index) in leftTab.tabMenu" :key="index" :label="item"></el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {reactive,defineComponent} from "vue";
import {useRouter} from 'vue-router'
import {ElContainer,ElHeader,ElMain,ElTabs,ElTabPane} from "element-plus";

export default defineComponent({
  name: "admin",
  components:{
    ElContainer,ElHeader,ElMain,ElTabs,ElTabPane
  },
  setup(){
    const router = useRouter()
    let welcome = reactive({
      title:"欢迎来到mall管理平台"
    })

    function checkUserIsLogin(){
      /**
       *  获取token，如果存在token则说明管理员已经登录，可以进入管理页面，反之则引导管理员进入登录界面
       * @param token 管理员登录后的凭证
       * @param checkUserIsLogin() 检测管理员是否登录
       */
      const token:string |null = sessionStorage.getItem('token')
      if (token){
        router.push('/')
        return true
      }
      else{
        router.push('/login')
        return false
      }
    }
    let checkIsLogin:boolean = checkUserIsLogin()

    /**
     *左侧标签栏
     * @param tabMenu 存储左侧标签栏菜单标题数据
     */
    let leftTab = reactive({
      tabMenu:['商品管理','订单管理','会员管理','营销管理','数据统计']
    })


    return {
      welcome,
      checkIsLogin,
      leftTab
    }
  }

})

</script>

<style scoped>
.admin-header{
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid #808080;
}
.admin-main{
  width: 100%;
  height: 90vh;
}
.left-tabs{
  height: 100%;
}
</style>
