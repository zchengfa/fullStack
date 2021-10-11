<template>
  <el-container>
    <el-header class="admin-header">欢迎管理员来到mall管理平台</el-header>
    <el-main class="admin-main">
      <el-tabs tab-position="left" class="left-tabs">
        <el-tab-pane label="商品管理">
          <el-button class="add-btn" type="primary" @click="addProduct">添加商品</el-button>
          <shop-manage
              :table-data="tableLogic.tableData"
          ></shop-manage>
        </el-tab-pane>
        <el-tab-pane label="会员管理">会员管理</el-tab-pane>
        <el-tab-pane label="营销管理">营销管理</el-tab-pane>
        <el-tab-pane label="数据统计">
          <data-statistics></data-statistics>
        </el-tab-pane>
      </el-tabs>

    </el-main>
  </el-container>
</template>

<script lang="ts">
import {reactive,defineComponent,onBeforeMount} from "vue";
import {useRouter} from 'vue-router'
import {ElContainer,ElHeader,ElMain,ElTabs,ElTabPane} from "element-plus";
import ShopManage from "../components/admin/shopManage/ShopManage.vue";
import {getShopManageData} from "../network/request";
import DataStatistics from "../components/admin/dataStatistics/DataStatistics.vue";

export default defineComponent({
  name: "admin",
  components:{
    ElContainer,ElHeader,ElMain,ElTabs,ElTabPane,
    ShopManage,
    DataStatistics
  },
  setup(){
    const router = useRouter()
    const token:string |null = sessionStorage.getItem('token')

    onBeforeMount(()=> {
      if (checkUserIsLogin()){
        getSMData()
      }
    })

    /**
     *  获取token，如果存在token则说明管理员已经登录，可以进入管理页面，反之则引导管理员进入登录界面
     * @param token 管理员登录后的凭证
     * @function checkUserIsLogin() 检测管理员是否登录
     */
    function checkUserIsLogin(){
      if (token){
        router.push('/')
        return true
      }
      else{
        router.push('/login')
        return false
      }
    }

    function addProduct(){
      alert('功能开发中')
    }

    /**
     *@function getShopManageData 获取商品管理数据
     */
    function getSMData (){
      getShopManageData().then(result =>{
        let shopManageData:any[] = []
        result.data.filter((item:any) =>{
          return shopManageData.push({
            id:<string>item.product_id,
            title:<string>item.title,
            imagePath:<string>item.imagePath,
            count:<string>item.favorite +'件',
            price:<string>item.price
          });

        })
        //console.log(result.data)
        tableLogic.tableData = shopManageData
        console.log(shopManageData)
      })
          .catch(err =>{
            throw err
          })
    }

    /**
     * @param tableData 存储表格内的数据
     */

    let tableLogic = reactive({
      tableData:<any[]>[],
    })
    return {
      tableLogic,
      addProduct
    }
  }

})

</script>

<style scoped>
.admin-header{
  width: 100%;
  height: 10vh;
	color: #fff;
	line-height: 10vh;
	font-weight: bolder;
  border-bottom: 1px solid #808080;
	background-image: url('../assets/image/admin/adminBanner.jpeg');
}
.add-btn {
  float: left;
  margin-left: 2rem;
}
.admin-main{
  width: 100%;
  height: 100%;
}
.left-tabs{
  height: 100%;
}
</style>
