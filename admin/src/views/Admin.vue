<template>
  <el-container class="menu-container shopM-con">
    <div class="content">
      <div class="administrator">
        <el-avatar v-if="!administrator.info.avatar" icon="el-icon-user-solid"></el-avatar>
        <el-avatar v-else :src="administrator.info.avatar"></el-avatar>
        <div class="user-name">
          <span>管理员:{{administrator.info.account}}</span>
        </div>
      </div>
      <el-menu class="menu">
        <el-menu-item v-for="(item,index) in shopMenu.menu" :key="item" :index="index">{{item}}</el-menu-item>
      </el-menu>
    </div>
  </el-container>
  <el-container class="table-container shopM-con">
    <div class="shop-mana">
      <div class="btn-group">
        <el-button class="add-btn" type="primary" @click="addProduct">添加商品</el-button>
      </div>
      <shop-manage
          :table-data="tableLogic.tableData"
      ></shop-manage>
    </div>
  </el-container>
  <add-product ref="ruleForm" v-show="addProductLogic.isShowAddProduct"
               @cancel-add-click="cancelAddClick"
               @confirm-add-click="confirmAddClick"
  ></add-product>
</template>
<script lang="ts">
    import {reactive,defineComponent,onBeforeMount} from "vue";
    import {useRouter} from 'vue-router'
    import {ElContainer,ElHeader,ElMain,ElTabs,ElTabPane} from "element-plus";
    import ShopManage from "../components/admin/shopManage/ShopManage.vue";
    import {getShopManageData,addProduct,getAdministratorInfo} from "../network/request";
    import DataStatistics from "../components/admin/dataStatistics/DataStatistics.vue";
    import AddProduct from '../components/admin/shopManage/AddProduct.vue';

    export default defineComponent({
      name: "admin",
      components:{
        ElContainer,ElHeader,ElMain,ElTabs,ElTabPane,
        ShopManage,
        DataStatistics,
        AddProduct
      },
      setup(){
        const router = useRouter()
        const token:string |null = sessionStorage.getItem('token')

        onBeforeMount(()=> {
          if (checkUserIsLogin()){
            getSMData()
            getAdminInfo()
          }
        })

        let administrator = reactive({
          info:{
            avatar:<string>'',
            account:<string>''
          }
        })

        function getAdminInfo(){
          getAdministratorInfo(token).then(result =>{
            if (result.data.info){
              administrator.info.avatar = result.data.info.avatar
              administrator.info.account = result.data.info.account
            }
            console.log(result)
          }).catch(err =>{
            console.log(err)
          })
        }

        let shopMenu = reactive({
          menu:<string[]>['商品管理','数据统计']
        })
        /**
         *  获取token，如果存在token则说明管理员已经登录，可以进入管理页面，反之则引导管理员进入登录界面
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

        /**
         * @function addProduct 点击按钮控制添加商品的页面显示与隐藏
         */
        let addProductLogic = reactive({
          isShowAddProduct:<boolean>false
        })
        function addProduct(){
          addProductLogic.isShowAddProduct = ! addProductLogic.isShowAddProduct
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
            //console.log(shopManageData)
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
          administrator,
          tableLogic,
          addProductLogic,
          addProduct,
          shopMenu
        }
      },
      methods:{
        //实现子组件发出的cancelAddClick方法
        cancelAddClick(){
          //关闭添加商品组件
          this.addProductLogic.isShowAddProduct = false
        },
        //实现子组件发出的confirmAddClick方法
        confirmAddClick(ruleForm:any){
          //点击确认添加商品按钮，将商品数据提交给后台保存并接收后台返回的处理结果，若后台返回结果为成功则立即关闭当前组件，反之则将错误反馈给用户
            addProduct(ruleForm).then(result => {
              //根据后台反馈判断商品是否添加成功，若成功则将数据push进tableData中进行数据更新显示
              if (result.data.success){
                this.tableLogic.tableData.push({
                  id:<string>result.data.product_id,
                  title:<string>ruleForm.description,
                  imagePath:<string>ruleForm.imageLink,
                  count:<string>ruleForm.productCount +'件',
                  price:<string>'￥'+ruleForm.price
                })

                //接收到后台添加商品数据成功的反馈，关闭添加商品组件
                this.addProductLogic.isShowAddProduct = false
              }

            }).catch(err => {
              console.log(err)
            })

        }
      }

    })

    </script>

    <style scoped>
    .shopM-con{
      float: left;
      height: 100vh;
    }
    .menu-container{
      margin-left: 0;
      width: 10vw;
      min-width: 10rem;
    }
    .table-container{
      margin-left: 1rem;
      width: 89vw;
    }
    .content{
      width: 100%;
      height: 100%;
    }
    .administrator{
      width: 100%;
      height: 14%;
      font-size:smaller;
      background-color: red;
    }
    .menu{
      width: 100%;
      height: 86%;
      color: #1e8efc !important;
      background-color: #4d4b4b;
    }
    .shop-mana{
      width: 100%;
      height: 100%;
    }
    .btn-group{
      display: flex;
      align-items: center;
      margin-top: 2rem;
      width: 60%;
      height: 10%;
      border: 1px solid #dedada;
    }

    </style>
