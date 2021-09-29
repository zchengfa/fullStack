<template>
  <el-container>
    <el-header class="admin-header">{{welcome.title}}</el-header>
    <el-main class="admin-main">
      <el-tabs tab-position="left" class="left-tabs"  @tab-click="showCurrentTabContent" >
        <el-tab-pane v-for="(item,index) in leftTab.tabMenu" :key="index" :label="item">
          <el-table v-show="isShowOrHidden.isShowTable" :data="tableLogic.tableData" >
            <el-table-column v-for="(header,headerIndex) in tableLogic.tableHeader" :key="header" :prop="returnTableProp(headerIndex,tableLogic.tableData)"  :label="header"></el-table-column>
          </el-table>
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
      tabMenu:<string[]>['商品管理','订单管理','会员管理','营销管理','数据统计']
    })

    let isShowOrHidden= reactive({
      isShowTable:<boolean>true,
      isShowOrder:<boolean>false,
      isShowVip:<boolean>false,
      isShowSell:<boolean>false,
      isShowData:<boolean>false,
    })
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

    /**
     * @param returnTableProp 是一个返回tableData表中需要的prop值的函数
     * @param index 方法接收index索引值,通过索引值判断这是哪一列
     * @param data 方法接收一个数组,遍历数组得到数组中对象存在的属性名（因为data数组中每个对象中的属性名都一致，只需遍历其中一个对象即可）
     * @param dataPropertyArray 将data数组中对象存在的属性名存储的数组
     */
    function returnTableProp(index:number,data: any[]) {
      let dataPropertyArray = getPropertyArray(data[0])
          //因为data数组中每个对象中的属性名都一致，只需遍历第一个对象即可
      return dataPropertyArray[index];
    }

    /**
     * @param getPropertyArray 用于获取数组或对象中需要的属性名，将属性名加入到新数组中并返回
     * @param _propertyArray 是一个用于存储属性名的数组
     * @param array 接收一个数组
     */

    function getPropertyArray (array:any){
      let _propertyArray:(keyof typeof array)[] = []
      for (const arrayKey in array) {
        _propertyArray.push(arrayKey)
      }
      return _propertyArray
    }

    return {
      welcome,
      checkIsLogin,
      leftTab,
      showCurrentTabContent,
      isShowOrHidden,
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
