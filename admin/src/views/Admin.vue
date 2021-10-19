<template>
  <el-container class="menu-container shopM-con">
    <div class="content">
      <div class="administrator">
        <div class="avatar-box">
         <el-avatar v-if="!administrator.info.avatar" icon="el-icon-user-solid"></el-avatar>
         <el-avatar v-else :src="administrator.info.avatar"></el-avatar>
        </div>
        <div class="user-name">
          <span>管理员:{{administrator.info.account}}</span>
        </div>
      </div>
      <el-menu class="menu">
        <el-menu-item class="menu-item" v-for="(item,index) in shopMenu.menu" :key="index" :index="index+''">
          <slot>
            <button class="menu-btn" @click="changeMenuItem(index)" :class="{'menu-btn-active':shopMenu.currentIndex===index}">{{item}}</button>
          </slot>
        </el-menu-item>
      </el-menu>
    </div>
  </el-container>
  <el-container class="table-container shopM-con">
    <div class="shop-mana" v-show="shopMenu.currentIndex===0" >
      <div class="btn-group">
        <el-button class="add-btn" type="primary" @click="addProduct">添加商品</el-button>
      </div>
      <shop-manage
          :table-data="tableLogic.tableData"
      ></shop-manage>
    </div>
    <div class="data-statistics" v-show="shopMenu.currentIndex===1">
      <data-statistics></data-statistics>
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

        /**
         * @param administrator 用管理员页面展示管理员信息
         * @function getAdminInfo 用于获取管理员信息
         * 将管理员登录成功后得到的token传给后台验证，后台返回管理员信息
        */
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

        /**
         * @param menu 存储菜单名
         * @param currentIndex 用于存储用户当前点击菜单项索引，用索引控制对应内容的展示与隐藏
         * @function changeMenuItem 用户点击菜单，获取到点击的菜单索引。并将其赋给currentIndex
         */
        let shopMenu = reactive({
          menu:<string[]>['商品管理','数据统计'],
          currentIndex:<number>0
        })

        function changeMenuItem (index:number){
          shopMenu.currentIndex = index
        }

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
          shopMenu,
          changeMenuItem
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
      width: 12vw;
      min-width: 10rem;
      color: #fff;
    }
    .table-container{
      margin-left: 1rem;
      width: 87vw;
    }
    .content{
      width: 100%;
      height: 100%;
    }
    .administrator{
      width: 100%;
      height: 14%;
      font-size:smaller;
      background-color: #343333;
    }
    .avatar-box{
      padding-top: 1rem;
    }
    .user-name{
      padding-top: 1rem;
    }
    .menu{
      width: 100%;
      height: 86%;
      background-color: #4d4b4b;
    }
    .menu-item:hover{
      background-color: #5d5858;
    }
    .menu-btn{
      width: 100%;
      height: 96%;
      border: none;
      background-color: inherit;
      color: #ccc9c9;
      font-weight: bolder;
      cursor: pointer;
    }
    .menu-btn-active{
      color: #32b1e0;
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
