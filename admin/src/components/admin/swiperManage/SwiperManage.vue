<template>
  <swiper :key="swiperKey" direction="horizontal" :modules="[EffectCoverflow,Autoplay]" effect="coverflow" class="swiper" :autoplay="{
    delay: 3000,
    disableOnInteraction: false
  }">
    <swiper-slide v-for="(item,index) in table.manageData" :key="index" v-show="item.isShow">
      <img :src="item.banner_image" alt="banner">
    </swiper-slide>
  </swiper>
  <el-table :data="table.currentPageData" class="swiper-table" max-height="450"   :header-cell-style="headerStyle" :cell-style="rowStyle" border empty-text="用户数据为空">
    <el-table-column prop="id" label="序号" align="center"></el-table-column>
    <el-table-column width="414" prop="banner_image" label="图片链接" align="center">
      <template #default="scope">
        <div class="image-column-box"><span>{{scope.row.banner_image}}</span></div>
      </template>
    </el-table-column>
    <el-table-column  prop="brand" label="所属品牌" align="center"></el-table-column>
    <el-table-column  prop="isShow" label="是否在项目中展示" align="center">
      <template #default="scope">
        <span v-if="scope.row.isShow">正在展示</span>
        <span v-else>已取消展示</span>
      </template>
    </el-table-column>
    <el-table-column  prop="isShow" label="操作" align="center">
      <template #default="scope">
        <el-button size="small" type="success" v-show="!scope.row.isShow" @click="operationBanner(scope.row)" v-permission="{permission:'open',effect:'disabled'}">开启轮播</el-button>
        <el-button size="small" type="danger" v-show="scope.row.isShow" @click="operationBanner(scope.row)" v-permission="{permission:'close',effect:'disabled'}">关闭轮播</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, watchEffect} from "vue";
import {EffectCoverflow,Autoplay} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {getBannerData, operateBanner} from "../../../network/request";
import useTable from "../../../common/useTable";

import 'swiper/css';
import 'swiper/css/effect-fade';
import Pagination from "../../common/Pagination.vue";

export default defineComponent({
  name:'SwiperManage',
  components: {
    Pagination,
    Swiper,
    SwiperSlide,
  },
  setup() {

    const {table,currentPageChange} = useTable(4)

    let swiperKey = ref(0)

    const headerStyle = ()=>{
      return {
        backgroundColor: '#88da0b',
        color:'#fff'
      }
    }

    //@ts-ignore
    const rowStyle = ({rowIndex})=>{
      if(rowIndex%2===0){
        return {
          background:'#dddddd'
        }
      }
      else{
        return {
          background:'#ffffff'
        }
      }
    }

    const getBanner = ()=>{
      getBannerData().then(res=>{
        table.manageData.push(...res.data)
        table.tableData.push(...table.manageData)
      })
    }
    getBanner()

    const operationBanner = (row: { isShow: boolean; brand_id: number; })=>{
      operateBanner({
        isShow:row.isShow,
        id:row.brand_id
      }).then(res=>{
        if (res.data){
          table.tableData.map((item:any)=>{
            if (item['brand_id'] === row.brand_id){
              item.isShow = res.data.operation_responsive
            }
          })

          //改变swiper组件的key值，刷新swiper组件
          swiperKey.value ++
        }
      })
    }

    return {
      EffectCoverflow,
      Autoplay,
      swiperKey,
      table,
      currentPageChange,
      headerStyle,
      rowStyle,
      operationBanner
    };
  },
})
</script>

<style scoped>
.swiper{
  width: 60%;
  height: 30vh;
}
img{
  height: 100%;
  background-size: cover;
}
.swiper-table{
  margin: 5vh auto;
  width: 90%;
}
.image-column-box span{
  color: red;
}
.pagination{
  margin: 1vh auto;
  width: 60%;

}
</style>
