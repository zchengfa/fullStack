<template>
  <el-container>
    <el-header class="admin-header">{{welcome.title}}</el-header>
    <el-main class="admin-main">
      <el-tabs tab-position="left" class="left-tabs">
        <el-tab-pane v-for="(item,index) in leftTab.tabMenu" :key="index" :label="item">
          <el-table :data="tableLogic.tableData">
            <el-table-column v-for="(header,headerIndex) in tableLogic.tableHeader" :key="header" :prop="returnTableProp(headerIndex)"  :label="header"></el-table-column>
          </el-table>
        </el-tab-pane>
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
      tabMenu:<object>['商品管理','订单管理','会员管理','营销管理','数据统计']
    })

    /**
     * @param tableData 存储表格内的数据
     */

    let tableLogic = reactive({
      tableHeader:<Object>['商品描述', '商品图片', '数量', '价格'],
      tableData:[
        {
          title:<string>'我是商品标题',
          image:<string>'我是商品图片链接',
          count:<number>10,
          price:<number>18
        },
        {
          title:<string>'我是商品标题2',
          image:<string>'我是商品图片链接2',
          count:<number>102,
          price:<number>182
        }
      ]
    })
    function returnTableProp(index:number) {
      switch (index){
        case 0:
          return 'title';

        case 1:
          return 'image'

        case 2:
          return 'count'

        case 3:
          return 'price'

      }
    }

    return {
      welcome,
      checkIsLogin,
      leftTab,
      tableLogic,
      returnTableProp
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
