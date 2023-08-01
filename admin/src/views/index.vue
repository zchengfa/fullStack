<script lang="ts" setup>
import { userStore } from "../pinia/pinia";
import { reactive, onBeforeMount, onMounted, ref,getCurrentInstance,ComponentInternalInstance } from "vue";
import { getTime, getWeek, getYear } from "../common/utils";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { Goods, Grape, Management, Setting, Timer, TrendCharts, Unlock, User, Van, Watch } from '@element-plus/icons-vue'
import SkewArrow from "../components/common/SkewArrow.vue";

let router = useRouter()
let userPinia = userStore()
const { userInfo } = storeToRefs(userPinia)
const { appContext } = getCurrentInstance() as ComponentInternalInstance

const centerDialogVisible = ref(false)
let navLogic = reactive({
  time:{
    year:<string>getYear(),
    week:<string>getWeek(),
    currentTime:<string>'',
  },
  defaultPath:<string>userPinia.rights[0].children[0].path
})

let isDefaultActive = ref(true)

const typeArr = ref(['default','primary','success','info','warning','danger'])

interface activePath {
  index:string,
  indexPath:string[]
}
const activeItem = (data:activePath)=>{

  data.index === '/logout' ? (()=>{
    centerDialogVisible.value = true

  })() :(()=>{
    router.push('/index'+ data.index)

    let rights = userPinia.rights , name = ''
    rights.forEach((item:any)=>{
      if(item.name === data.indexPath[0] ){
        item.children.forEach((i:any)=>{
          if(i.path === data.indexPath[1]){
            name = i['children_name']
          }
        })
      }
    })
    userPinia.setSkewMenu(JSON.stringify({
      'name':name,
      'path':data.indexPath[1],
      'type':typeArr.value[Math.floor(Math.random()*(typeArr.value.length))]
    }))

  })()

  isDefaultActive.value = false
}

function confirmDialog(){
  //删除浏览器中存储的登录信息
  userPinia.setToken('')
  userPinia.setUserInfo(JSON.stringify({}))
  userPinia.setRights(JSON.stringify([]))
  router.push('/login')
}

function closeSkew(name:string){
  userPinia.closeSkewMenu(name).then(path=>{
    router.push('/index'+path)
    navLogic.defaultPath =<string>path

  }).catch(err=>{
    if(err.msg){
      appContext.config.globalProperties.$toast.showToast(err.msg,3000,'操作错误')
    }
    else if(err.path){
      navLogic.defaultPath =<string>err.path
      window.location.reload()
    }

  })
}

onBeforeMount(()=> {
  getTime(navLogic.time.currentTime)
})

onMounted(()=>{
  router.push('/index/goods')

  userPinia.setSkewMenu(JSON.stringify({
    'name':userPinia.rights[0].children[0]['children_name'],
    'path':userPinia.rights[0].children[0]['path'],
    'type':typeArr.value[Math.floor(Math.random()*(typeArr.value.length))]
  }))

  isDefaultActive.value = true
})

</script>

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
              <el-avatar v-if="!userInfo.avatar" icon="el-icon-user-solid"></el-avatar>
              <el-avatar v-else :src="userInfo.avatar"></el-avatar>
            </div>
            <div class="user-name">
              <span>管理员:{{userInfo.account}}</span>
            </div>
          </div>
        </li>
      </ul>
    </el-col>
  </el-row>
  <el-row style="flex-wrap: nowrap">
    <el-col :span="3" class="menu-col">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#fff"
          text-color="#000"
          :default-active="navLogic.defaultPath"
          class="el-menu-vertical-demo"
      >
        <el-sub-menu :index="item.name" v-for="(item,i) in userPinia.rights" :key="item.id">

          <template #title>
            <el-icon class="menu-title-icon" v-if="item.icon==='Goods'"><Goods></Goods></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='User'"><User></User></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Timer'"><Timer></Timer></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Van'"><Van></Van></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Unlock'"><Unlock></Unlock></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Watch'"><Watch></Watch></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Grape'"><Grape></Grape></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Management'"><Management></Management></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='TrendCharts'"><TrendCharts></TrendCharts></el-icon>
            <el-icon class="menu-title-icon" v-else-if="item.icon==='Setting'"><Setting></Setting></el-icon>
            {{item.name}}
          </template>
          <div v-if="item.children" class="menu-children-box">
            <el-menu-item :class="{'is-actived':cIndex === 0 && i===0} && isDefaultActive === true"   @click="activeItem" v-for="(child,cIndex) in item.children" :key="child.id" :index="child.path">{{child.children_name}}</el-menu-item>
          </div>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :span="21" class="router-view-col">
      <skew-arrow :menu="userPinia.routesSkewMenu" @close-skew="closeSkew"></skew-arrow>
      <router-view></router-view>
    </el-col>
  </el-row>
  <el-dialog v-model="centerDialogVisible" title="操作确认" width="30%" center>
    <span style="display: inline-block;width:100%;text-align: center;">
      是否退出后台管理
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">
          确认退出
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.nav-row{
  height: 3rem;
}
.nav-col{
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: #fff;
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

/**
*侧边菜单栏
 */
.menu-children-box{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;

}
.el-menu-item{
  color: #a8a3a3;
  text-align: left;
  text-indent: 30px;

}
.el-menu-item.is-active{
  color: #3a7af3;
}
.menu-title-icon{
  position: relative;
  top:-3px;
  right:10px;
}
.menu-col{
  max-height: calc(100vh - 3rem);
  min-width: 200px;
  overflow-y: scroll;
}
.menu-col::-webkit-scrollbar{
  display: none;
}
.router-view-col{
  max-height: calc(100vh - 3rem);
  overflow-y: scroll;
}
</style>