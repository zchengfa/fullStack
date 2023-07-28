<script lang="ts" setup>
import { userStore } from "../pinia/pinia";
import {reactive, onBeforeMount, onMounted, ref} from "vue";
import { getTime, getWeek, getYear } from "../common/utils";
import { storeToRefs } from "pinia";
import {useRouter} from "vue-router";
import {Goods, Grape, Management, Setting, Timer, TrendCharts, Unlock, User, Van, Watch} from '@element-plus/icons-vue'

let router = useRouter()

let userPinia = userStore()
const { userInfo } = storeToRefs(userPinia)

let navLogic = reactive({
  time:{
    year:<string>getYear(),
    week:<string>getWeek(),
    currentTime:<string>''
  }
})

let isDefaultActive = ref(true)

interface activePath {
  index:string,
  indexPath:string[]
}
const activeItem = (data:activePath)=>{
  router.push('/index'+ data.index)
  isDefaultActive.value = false
}



onBeforeMount(()=> {
  // if (checkUserIsLogin()){
  //   getSMData()
  //   getAdminInfo()
  //   getMMData()
  //   getTime(navLogic.time.currentTime)
  // }

  getTime(navLogic.time.currentTime)
})

onMounted(()=>{
  router.push('/index/goods')
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
  <el-row>
    <el-col :span="3">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#fff"
          text-color="#000"
          default-active="/goods"
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
          <div v-if="item.children">
            <el-menu-item :class="{'is-actived':cIndex === 0 && i===0} && isDefaultActive === true" style="padding-left: 70px;"  @click="activeItem" v-for="(child,cIndex) in item.children" :key="child.id" :index="child.path">{{child.children_name}}</el-menu-item>
          </div>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :span="21">
      <router-view></router-view>
    </el-col>
  </el-row>

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
.el-menu-item{
  color: #a8a3a3;
}
.el-menu-item.is-active{
  color: #3a7af3;
}
.menu-title-icon{
  position: relative;
  top:-3px;
  right:10px;
}
</style>