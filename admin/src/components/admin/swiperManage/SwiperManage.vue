<template>
  <swiper :modules="[EffectCoverflow]" effect="coverflow" class="swiper" autoplay>
    <swiper-slide v-for="(item,index) in banner.data" :key="index" v-show="item['isShow']">
      <img :src="item['banner_image']" alt="banner">
    </swiper-slide>
  </swiper>
  <el-table :data="banner.tableData" class="swiper-table" :header-cell-style="headerStyle" :cell-style="rowStyle" border empty-text="用户数据为空">
    <el-table-column width="200" prop="id" label="序号" align="center"></el-table-column>
    <el-table-column  prop="banner_image" label="图片链接" align="center"></el-table-column>
    <el-table-column width="200" prop="brand" label="所属品牌" align="center"></el-table-column>
    <el-table-column width="300" prop="isShow" label="是否在项目中展示" align="center">
      <template #default="scope">
        <span v-if="scope.row.isShow">正在展示</span>
        <span v-else>已取消展示</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="pagination" :page-size="banner.pageSize" :total="banner.data.length" @current-change="currentPageChange"></el-pagination>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, watchEffect} from "vue";
import {EffectCoverflow} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue';
import {getBannerData} from "../../../network/request";

import 'swiper/css';
import 'swiper/css/effect-fade';

export default defineComponent({
  name:'SwiperManage',
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {

    let banner = reactive({
      data:<string[]>[],
      tableData:<string[]>[],
      pageSize:<number>6
    })

    const headerStyle = ()=>{
      return "background:#606bff;color:#fff"
    }

    const rowStyle = ({rowIndex})=>{
      if(rowIndex%2===0){
        return "background:#dddddd;"
      }
      else{
        return "background:#ffffff;"
      }
    }

    const getBanner = ()=>{
      getBannerData().then(res=>{
        banner.data.push(...res.data)
        banner.tableData.push(...banner.data)
      })
    }
    getBanner()

    const currentPageChange = (val:number)=>{
      if (val===1){
        banner.tableData = sliceTableData(val-1,banner.pageSize)
      }
      else {
        banner.tableData = sliceTableData((val-1)*banner.pageSize,((val-1)*banner.pageSize)+banner.pageSize)
      }
    }

    const sliceTableData = (start:number,end:number)=>{
      return banner.data.slice(start,end)
    }

    onMounted(()=>{
      watchEffect(()=>{
        banner.tableData = sliceTableData(0,banner.pageSize)
      })
    })

    return {
      EffectCoverflow,
      banner,
      currentPageChange,
      headerStyle,
      rowStyle
    };
  },
})
</script>

<style scoped>
.swiper{
  width: 80%;
  height: 30vh;
}
img{
  width: 100%;
  background-size:cover;
}
.swiper-table{
  margin: 5vh auto;
  width: 90%;
}
</style>