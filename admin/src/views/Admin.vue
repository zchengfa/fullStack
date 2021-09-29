<template>
  <el-container>
    <el-header class="admin-header">{{welcome.title}}</el-header>
    <el-main class="admin-main">
      <el-tabs tab-position="left" class="left-tabs"  @tab-click="showCurrentTabContent" >
        <el-tab-pane v-for="(item,index) in leftTab.tabMenu" :key="index" :label="item">
          <shop-manage
              :table-data="tableLogic.tableData"
              :table-header="tableLogic.tableHeader"
              :is-show-table="isShowOrHidden.isShowTable"
          ></shop-manage>
          <div class="order" v-show="isShowOrHidden.isShowOrder">订单管理</div>
          <div class="order" v-show="isShowOrHidden.isShowVip">会员管理</div>
          <div class="order" v-show="isShowOrHidden.isShowSell">营销管理</div>
          <div class="order" v-show="isShowOrHidden.isShowData">数据统计</div>
        </el-tab-pane>
      </el-tabs>

    </el-main>
  </el-container>
</template>

<script lang="ts">
import {reactive,defineComponent} from "vue";
import {useRouter} from 'vue-router'
import {ElContainer,ElHeader,ElMain,ElTabs,ElTabPane} from "element-plus";
import ShopManage from "../components/admin/ShopManage.vue";
import {getPropertyArray} from "../common/utils";
import {getShopManageData} from "../network/request";

export default defineComponent({
  name: "admin",
  components:{
    ElContainer,ElHeader,ElMain,ElTabs,ElTabPane,
    ShopManage
  },
  setup(){
    const router = useRouter()
    let welcome = reactive({
      title:"欢迎来到mall管理平台"
    })

    /**
     *  获取token，如果存在token则说明管理员已经登录，可以进入管理页面，反之则引导管理员进入登录界面
     * @param token 管理员登录后的凭证
     * @function checkUserIsLogin() 检测管理员是否登录
     */
    function checkUserIsLogin(){

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
      tabMenu:<string[]>['商品管理','订单管理','会员管理','营销管理','数据统计']
    })

    let isShowOrHidden= reactive({
      isShowTable:<boolean>true,
      isShowOrder:<boolean>false,
      isShowVip:<boolean>false,
      isShowSell:<boolean>false,
      isShowData:<boolean>false,
    })

    /**
     *@function showCurrentTabContent 控制点击对应标签栏显示对应的标签内容，隐藏与当前标签无关的内容
     *@param isShowOrHiddenKeyArray 用于存储isShowOrHidden对象的属性名的数组
     */
    function showCurrentTabContent(event:any){
      let isShowOrHiddenKeyArray:(keyof typeof isShowOrHidden)[]= getPropertyArray(isShowOrHidden)
      for (let i = 0;i<isShowOrHiddenKeyArray.length;i++){
        /**
         *问题：该语句可以生效，但会导致typescript类型语法冲突而报错
         *解决: 不设置变量的具体类型，根据返回值自动设置类型
         */
        Number(event.index) === i ?isShowOrHidden[isShowOrHiddenKeyArray[i]]=true:isShowOrHidden[isShowOrHiddenKeyArray[i]]=false
      }
    }

    /**
     * @param tableData 存储表格内的数据
     */

    let tableLogic = reactive({
      tableHeader:<string[]>['商品描述', '商品图片', '数量', '价格'],
      tableData:<any[]>[]
    })

    /**
     *@function getShopManageData 获取商品管理数据
     */
    function getSMData (){
      getShopManageData().then(result =>{
        let shopManageData:string[] = []
        result.data.filter(item =>{
          shopManageData.push({
            title:item.title,
            imagePath:item.imagePath,
            count:item.favorite,
            price:item.price
          })
          //console.log(item)
        })
        tableLogic.tableData = shopManageData
        console.log(shopManageData)
      })
      .catch(err =>{
        throw err
      })
    }
    let _getSMData = getSMData()

    return {
      welcome,
      checkIsLogin,
      leftTab,
      showCurrentTabContent,
      isShowOrHidden,
      tableLogic,
      _getSMData
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
.admin-main{
  width: 100%;
  height: 90vh;
}
.left-tabs{
  height: 100%;
}
</style>
