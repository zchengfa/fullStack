<template>
  <el-row class="nav-row">
    <el-col class="nav-col">
      <ul>
        <li class="time">
          <div>
            <span>{{navLogic.time.year}}</span>
            <span class="current-time">{{navLogic.time.currentTime}}</span>
            <span>{{navLogic.time.week}}</span>
          </div>
        </li>
        <li>
          <a href="/">支持我们</a>
        </li>
        <li>
          <a href="/">联系开发者</a>
        </li>
        <li>
          <div class="administrator">
            <div class="avatar-box">
              <el-avatar v-if="!administrator.info.avatar" icon="el-icon-user-solid"></el-avatar>
              <el-avatar v-else :src="administrator.info.avatar"></el-avatar>
            </div>
            <div class="user-name">
              <span>管理员:{{administrator.info.account}}</span>
            </div>
          </div>
        </li>
      </ul>
    </el-col>
  </el-row>
  <el-row class="content-row">
    <el-col class="content-col">
      <el-container class="menu-container shopM-con">
        <div class="content">
          <el-menu class="menu">
            <el-menu-item class="menu-item" v-for="(item,index) in shopMenu.menu" :key="index" :index="index+''">
              <slot>
                <el-icon v-if="index===0"><Goods></Goods></el-icon>
                <el-icon v-else-if="index===1"><User></User></el-icon>
                <el-icon v-else-if="index===2"><Timer></Timer></el-icon>
                <el-icon v-else-if="index===3"><Van></Van></el-icon>
                <el-icon v-else-if="index===4"><Unlock></Unlock></el-icon>
                <el-icon v-else-if="index===5"><Watch></Watch></el-icon>
                <el-icon v-else-if="index===6"><Grape></Grape></el-icon>
                <el-icon v-else-if="index===7"><Management></Management></el-icon>
                <el-icon v-else-if="index===shopMenu.menu.length-2"><TrendCharts></TrendCharts></el-icon>
                <el-icon v-else><Setting></Setting></el-icon>
                <el-button class="menu-btn" @click="changeMenuItem(index)" :class="{'menu-btn-active':shopMenu.currentIndex===index}">{{item}}</el-button>
              </slot>
            </el-menu-item>
          </el-menu>
        </div>
      </el-container>
      <el-container class="table-container shopM-con">
        <div class="shop-mana" v-show="shopMenu.currentIndex===0" >
          <div class="select-group">
            <el-button class="add-btn" type="primary" size="small" @click="addProduct">+添加商品</el-button>
            <div class="category-selector-box">
              <span>分类选择：</span>
              <el-select v-model="addProductLogic.categoryCheckOption" placeholder="全部" class="select">
                <el-option v-for="item in addProductLogic.selectCategoryOptions" :key="item" @click="showGoodsByCategoryOrBrand(item,'type')" :value="item" :label="item"></el-option>
              </el-select>
            </div>
            <div class="brand-selector-box">
              <span>品牌选择：</span>
              <el-select v-model="addProductLogic.brandCheckOption" placeholder="全部" class="select">
                <el-option v-for="item in addProductLogic.selectBrandOptions" :key="item" @click="showGoodsByCategoryOrBrand(item,'brand')" :value="item" :label="item"></el-option>
              </el-select>
            </div>
            <div class="search-box">
              <span>搜索：</span>
              <el-input class="search-input" v-model="addProductLogic.searchKeyword" @keyup="searchProduct($event)" placeholder="输入商品ID/分类/商品名称" suffix-icon="el-icon-search"></el-input>
            </div>
            <div class="export-data">
              <el-button type="success" size="small" @click="tableToExcel(tableLogic.tableData)">导出数据为Excel</el-button>
            </div>
          </div>
          <shop-manage
              :table-data="tableLogic.tableData"
          ></shop-manage>
        </div>
        <div class="member-mana" v-show="shopMenu.currentIndex===1">
          <div class="select-group">
            <div class="search-box">
              <span>搜索用户：</span>
              <el-input class="search-input" v-model="tableLogic.memberManaSearchKeyword" @keyup="searchUser($event)" placeholder="输入用户身份/昵称/账号" suffix-icon="el-icon-search"></el-input>
            </div>
          </div>
          <member-manage :table-data="tableLogic.memberData"></member-manage>
        </div>
        <div class="swiper-mana" v-show="shopMenu.currentIndex===2">
          <swiper-manage></swiper-manage>
        </div>
        <div class="stocks-mana" v-show="shopMenu.currentIndex===3">
          <stocks-manage></stocks-manage>
        </div>
        <div class="ground-mana" v-show="shopMenu.currentIndex===4">
          <ground-manage :ground-data="ground.data"></ground-manage>
        </div>
        <div class="seckill-mana" v-show="shopMenu.currentIndex===5">
          <seckill-manage :seckill-data="seckill.data" :no-seckill-data="seckill.noSeckill" :key="seckill.key"></seckill-manage>
        </div>
        <div class="order-mana" v-show="shopMenu.currentIndex===7">
          <order-manage></order-manage>
        </div>
        <div class="data-statistics" v-if="shopMenu.currentIndex===shopMenu.menu.length-2">
          <data-statistics></data-statistics>
        </div>
      </el-container>
    </el-col>
  </el-row>
  <add-product ref="ruleForm" v-show="addProductLogic.isShowAddProduct"
               @cancel-add-click="cancelAddClick"
               @confirm-add-click="confirmAddClick"
  ></add-product>
</template>
<script lang="ts">
    import {reactive,defineComponent,onBeforeMount,getCurrentInstance,ComponentInternalInstance} from "vue";
    import {useRouter} from 'vue-router'
    import {ElContainer,ElHeader,ElMain,ElTabs,ElTabPane,ElIcon} from "element-plus";
    import {Goods,User,TrendCharts,Unlock,Timer,Setting,Van,Watch,Grape,Management} from '@element-plus/icons-vue'
    import ShopManage from "../components/admin/shopManage/ShopManage.vue";
    import MemberManage from "../components/admin/memberManage/MemberManage.vue"
    import OrderManage from '../components/admin/orderManage/OrderManage.vue'
    import SwiperManage from '../components/admin/swiperManage/SwiperManage.vue'
    import StocksManage from '../components/admin/stocksManage/StocksManage.vue'
    import SeckillManage from '../components/admin/seckillManage/SeckillManage.vue'
    import GroundManage from "../components/admin/groundManage/GroundManage.vue";
    import {getShopManageData,addProduct,getAdministratorInfo,getMemberManageData,addSeckill} from "../network/request";
    import DataStatistics from "../components/admin/dataStatistics/DataStatistics.vue";
    import AddProduct from '../components/admin/shopManage/AddProduct.vue';

    import useTable from "../common/useTable";

    export default defineComponent({
      name: "admin",
      components:{
        ElContainer,ElHeader,ElMain,ElTabs,ElTabPane,ElIcon,
        Goods,User,TrendCharts,Unlock,Timer,Setting,Van,Watch,Grape,Management,
        ShopManage,
        MemberManage,
        SwiperManage,
        OrderManage,
        SeckillManage,
        DataStatistics,
        AddProduct,
        StocksManage,
        GroundManage
      },
      setup(){
        onBeforeMount(()=> {
          if (checkUserIsLogin()){
            getSMData()
            getAdminInfo()
            getMMData()
            getTime()
          }

        })
        const {appContext} = getCurrentInstance() as ComponentInternalInstance

        const router = useRouter()
        const token:string |null = sessionStorage.getItem('token')

        let navLogic=reactive({
          time:{
            year:<string>getYear(),
            week:<string>getWeek(),
            currentTime:<string>''
          }
        })

        function getYear(){
          let year = new Date().getFullYear()
          let month = new Date().getMonth()
          let date = new Date().getDate()
          return year+'-'+month+'-'+date
        }

        function getTime(){
          setInterval(()=>{
            let hour = new Date().getHours()
            let minutes = new Date().getMinutes().toString()
            let seconds = new Date().getSeconds().toString()
            if (Number(minutes) < 10){
              minutes = '0' + minutes
            }
            if (Number(seconds) < 10){
              seconds = '0' + seconds
            }
            navLogic.time.currentTime = hour+':'+minutes+':'+seconds
          },1000)
        }

        function getWeek(){
          let day = new Date().getDay()
          switch (day) {
            case 0:
              return '星期天';
            case 1:
              return '星期一';
            case 2:
              return '星期二';
            case 3:
              return '星期三';
            case 4:
              return '星期四';
            case 5:
              return '星期五';
            case 6:
              return '星期六';
          }
        }

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
            //console.log(result)
          }).catch(err =>{
            console.log(err)
          })
        }

        /**
         * @let menu 存储菜单名
         * @let currentIndex 用于存储用户当前点击菜单项索引，用索引控制对应内容的展示与隐藏
         * @function changeMenuItem 用户点击菜单，获取到点击的菜单索引。并将其赋给currentIndex
         */
        let shopMenu = reactive({
          menu:<string[]>['商品管理','用户管理','轮播管理','库存管理','商品上架','秒杀管理','优惠管理','订单管理','数据统计','系统设置'],
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
         * @let tableData 存储表格内需要展示的数据
         * @let shopManageData 存储后台获得的商品管理数据
         */

        let tableLogic = reactive({
          tableData:<any[]>[],
          shopManageData:<any[]>[],
          memberData:<any[]>[],
					memberDataCopy:<any[]>[],
					memberManaSearchKeyword:<string>''
        })

        //处理获取到的商品数据，将含有秒杀活动的商品进行汇总并传给子组件
        let seckill = reactive({
          data:<string[]>[],
          noSeckill:<string[]>[],
          key:<number>0
        });

        //商品上架所需数据
        let ground = reactive({
          data:<string[]>[]
        })

        /**
         *@function getShopManageData 获取商品管理数据
         */
        function getSMData (){
          getShopManageData().then(result =>{
            result.data.filter((item:any) =>{
              return tableLogic.shopManageData.push({
                id:<string>item.product_id,
                title:<string>item.product_title,
                imagePath:<string>item.product_image,
                count:<string>item.stocks +'件',
                price:<string>item.price,
                brand:<string>item.product_brand,
                type:<string>item.product_type
              });
            })

            //获取商品中的品牌跟类型、活动
            result.data.map((item:any)=>{
              if (addProductLogic.selectBrandOptions.indexOf(item['product_brand'])===-1){
                addProductLogic.selectBrandOptions.push(item['product_brand'])
              }
              if (addProductLogic.selectCategoryOptions.indexOf(item['product_type'])===-1){
                addProductLogic.selectCategoryOptions.push(item['product_type'])
              }

              //获取秒杀商品数据
              if (item.preferential_type==='秒杀'){
                seckill.data.push(item)
              }
              else{
                seckill.noSeckill.push(item)
              }

              //获取上架管理组件所需的数据
              ground.data.push(item)
            })
            tableLogic.tableData = tableLogic.shopManageData

          })
              .catch(err =>{
                throw err
              })
        }


        /**
         * @function addProduct 点击按钮控制添加商品的页面显示与隐藏
         * @let isShowAddProduct bool值代表添加商品按钮的显示与隐藏
         * @let selectCategoryOptions 分类选项组的内容
         * @let selectBrandOptions 品牌选项组的内容
         * @let categoryCheckOption 已选择的分类
         * @let brandCheckOption 已选择的品牌
         * @let searchKeyword 需要查询的关键字（ID/名称/分类）
         */
        let addProductLogic = reactive({
          isShowAddProduct:<boolean>false,
          selectCategoryOptions:<string[]>[],
          selectBrandOptions:<string[]>[],
          categoryCheckOption:<string>'',
          brandCheckOption:<string>'',
          searchKeyword:<string>''
        })

        function addProduct(){
          addProductLogic.isShowAddProduct = true
        }

        //点击具体分类或具体品牌名来展示对应的商品
        function showGoodsByCategoryOrBrand(item:string,regType:string){
          let operationArr:string[] = [],regExpArr:string[] = []
          operationArr.push(...tableLogic.shopManageData)

          let regExp:RegExp = new RegExp(item)
          regType==='brand'?addProductLogic.categoryCheckOption='':addProductLogic.brandCheckOption=''
          operationArr.map((items:any)=>{
            if (regExp.test(items['brand']) || regExp.test(items['type'])){
              regExpArr.push(items)
            }
          })
          tableLogic.tableData = regExpArr
        }

        /**
         *@function searchProduct 该方法用于管理员搜索想搜索的商品，通过绑定keyUp键盘事件来获取管理员按下的键来判断何时执行搜索方法
         * @let searchArr 获取从后台得到的商品数据
         * @let regExp 正则规则（new RegExp(addProductLogic.searchKeyword)将管理员输入的内容作为正则规则）
         * @let regExpArr 用于存储正则规则匹配到的商品数据
         */
        function searchProduct(e:any){
          if(e.keyCode===13){
            let arr = search(tableLogic.shopManageData,tableLogic.tableData,addProductLogic.searchKeyword,e.keyCode,['id','title'])
            tableLogic.tableData = arr
          }
          	
        }
				
				/**
				 *@function searchUser 该方法用于管理员搜索想搜索的用户，通过绑定keyUp键盘事件来获取管理员按下的键来判断何时执行搜索方法
				 * @let searchArr 获取从后台得到的用户数据
				 * @let regExp 正则规则（new RegExp(tableLogic.memberManaSearchKeyword)将管理员输入的内容作为正则规则）
				 * @let regExpArr 用于存储正则规则匹配到的用户数据
				 */
				const {search} = useTable(7)
				function searchUser(e:any){
          if(e.keyCode===13){
            let arr = search(tableLogic.memberDataCopy,tableLogic.memberData,tableLogic.memberManaSearchKeyword,e.keyCode,['identity','username','account'])
            tableLogic.memberData = arr
          }
				
				}

        /**
         * @function getMMData 该方法用于获取商城所有的用户数据
         */
        function getMMData(){
          getMemberManageData().then(result => {
            tableLogic.memberData = result.data
            tableLogic.memberData.filter(item => {

              !item.username?item.username = '暂未设置昵称': item.username
              !item.last_login_time?item.last_login_time = '暂未登录过': item.last_login_time
              switch (item.identity){
                case 0:
                  item.identity = '普通用户';
                  break;
                case 999:
                  item.identity = '客服';
                  break;
                case 1000:
                  item.identity = 'VIP';
                  break;
                default:
                  item.identity = '未知身份'
              }
            })
						tableLogic.memberDataCopy = tableLogic.memberData
            //console.log(result.data)
          }).catch(err =>{
            console.log(err)
          })
        }

        //监听事件总线发出的confirmAddSeckill事件
        appContext.config.globalProperties.$bus.on('confirmAddSeckill',(obj:{data:string[],time:string})=>{
          //获得添加到秒杀活动的商品数据，向后端发起请求将对应商品一一更改为秒杀商品
          addSeckill(obj.data,parseInt(obj.time.replace(':00',''))).then(res=>{
            if (res.data.addResult){
              alert('已将您选择的商品加入到秒杀活动中')
              obj.data.map((item:any)=>{
                seckill.noSeckill.map((noItem:any,index:number)=>{
                  if (item.product_id===noItem.product_id){
                    seckill.noSeckill.splice(index,1)
                    seckill.data.push(item)
                    seckill.key++
                  }
                })
              })
            }
          })

        })


        return {
          navLogic,
          administrator,
          tableLogic,
          seckill,
          addProductLogic,
          addProduct,
          searchProduct,
          shopMenu,
					searchUser,
          changeMenuItem,
          showGoodsByCategoryOrBrand,
          ground
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
        },
        tableToExcel(data:any[]){
          //列标题
          let head = `<tr class="table-header"><td>商品id</td><td>商品标题</td><td>图片</td><td>价格</td><td>库存</td></tr>`;
          let tbody="";//内容
          for (let item in data) {
            tbody+=
                `<tr class="product">
                        <td class="id">${data[item]['id'] + '\t'}</td>
                        <td class="title">${data[item]['title'] + '\t'}</td>
                        <td class="path">${data[item]['imagePath'] + '\t'}</td>
                        <td class="price">￥${data[item]['price'] + '\t'}</td>
                        <td class="stocks">${data[item]['count'] + '\t'}</td>
                    </tr>`
          }
          let str = head+tbody;//头部跟身体内容连接

          //Worksheet名
          let worksheet = '商品数据'
          let uri = 'data:application/vnd.ms-excel;base64,';

          //下载的表格模板数据(需要设置编码格式utf-8，不设置会在打开Excel文件时会乱码)
          let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:x="urn:schemas-microsoft-com:office:excel"
                  xmlns="http://www.w3.org/TR/REC-html40">
                  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                    <x:Name>${worksheet}</x:Name>
                    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                    <meta charset="UTF-8">
                    <style type="text/css">
                       .table-header td{
                            padding: 16px;
                            height: 60px;
                            text-align: center;
                            color: #FFFFFF;
                            background-color: #1e8efc;
                            border: 1px solid #8a8a8a;
                       }
                       .product{
                            text-align: center;
                       }
                       td{
                            padding: 16px;
                       }

                       .id{
                            color: #1e8efc;
                       }
                       .title{
                            color: #d91868;
                       }
                       .path{
                            color: orchid;
                            font-weight: bold;
                       }
                       .price{
                            width: 100px;
                            color: red;
                       }
                       .stocks{
                            width: 100px;

                       }
                    </style>
                    </head><body><table>${str}</table></body></html>`;
          //下载模板
          window.location.href = uri + this.base64(template)
        },
        //输出base64编码
        base64 (s:any) {
          return window.btoa(unescape(encodeURIComponent(s)))
        }
      }
    })

    </script>

    <style scoped>
    .nav-row{
      position: fixed;
      top:0;
      left: 0;
      width: 100%;
      z-index: 10;
    }
    .nav-col{
      box-shadow:0 .2rem .2rem 0 #96979a;
    }
    .nav-col ul{
      display: flex;
      justify-items: center;
      align-items: center;
      float: right;
      margin: 0;
      height: 3rem;
      min-width: 1000px;
    }
    ul .time span{
      display: inline-block;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    ul .time .current-time{
      width: 6rem;
    }
    .nav-col ul li{
      list-style-type: none;
      padding: 0 2rem;
      height: 3rem;
      line-height: 3rem;
    }
    a{
      display: block;
      height: 100%;
      text-decoration: none;
    }
    a::after{
      display: inline-block;
      padding-left: 2rem;
      content: '|';
      height: 2rem;
      color: black;
    }
    li .administrator{
      display: flex;
      height: 100%;
    }
    .administrator .user-name span{
      margin-left: 1rem;
    }
    .content-row{
      padding-top:70px;
      overflow: hidden;
    }
    .content-col{
      display: flex;
      height: calc(100vh - 87px);
    }
    .shopM-con::-webkit-scrollbar{
      display: none;
    }
    .menu-container{
      flex: 1;
      width: 10vw;
      min-width: 150px;
    }
    .menu-container .content{
      margin: 0 auto;
      width: 100%;
    }
    .menu{
      width: 100%;
      height: 100%;
    }
    .menu button:hover{
      color: #0a36e1;
    }
    .menu button{
      padding-left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    .select-group{
      display: flex;
      align-items: center;
      width: 80%;
      min-width: 1000px;
      height: 5rem;
      border: 1px solid #dedada;
    }
    .select-group div,.select-group button{
      margin-left: 1rem;
      margin-right: 1rem;
    }
    .select-group .select{
      width: 7rem;
    }
    .select-group .search-box{
      display: flex;
      justify-items: center;
      align-items: center;
      min-width: 260px;
    }
    .search-box span{
      flex: 2;
      min-width: 3rem;
    }
    .search-box .search-input{
      flex: 9;
    }
    .table-container{
      flex: 10;
    }

    .table-container div.shop-mana,
    .table-container div.member-mana,
    .table-container div.swiper-mana,
    .table-container div.order-mana,
    .table-container div.seckill-mana,
    .table-container div.ground-mana{
      width: calc(100vw - 15rem);
    }
    .shop-mana{
      margin: 0 auto;
    }
    .member-mana .select-group{
      margin-left: 1rem;
      width: 50%;
      min-width: 300px;
    }
    .member-mana .select-group span{
      min-width: 6rem;
    }
    .data-statistics{
      margin: 0 auto;
      width: 88vw;

      background-color: rgb(242, 236, 247);
    }
    .seckill-mana{
      margin: 0 auto;
      overflow-y: scroll;
    }
    .seckill-mana::-webkit-scrollbar{
      display: none;
    }
    .ground-mana{
      margin: 0 auto ;
    }
    /*.data-statistics::-webkit-scrollbar{*/
    /*  display: none;*/
    /*}*/
    </style>
