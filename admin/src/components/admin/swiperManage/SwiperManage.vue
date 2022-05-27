<template>
  <swiper :key="swiperKey" :modules="[EffectCoverflow]" effect="coverflow" class="swiper" autoplay>
    <swiper-slide v-for="(item,index) in banner.data" :key="index" v-show="item['isShow']">
      <img :src="item['banner_image']" alt="banner">
    </swiper-slide>
  </swiper>
  <el-table :data="banner.tableData" class="swiper-table" :header-cell-style="headerStyle" :cell-style="rowStyle" border empty-text="用户数据为空">
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
        <el-button size="small" type="success" v-show="!scope.row.isShow" @click="operationBanner(scope.row)">开启轮播</el-button>
        <el-button size="small" type="danger" v-show="scope.row.isShow" @click="operationBanner(scope.row)">关闭轮播</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="pagination" :page-size="banner.pageSize" :total="banner.data.length" @current-change="currentPageChange"></el-pagination>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, watchEffect} from "vue";
import {EffectCoverflow} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue';
import {getBannerData, operateBanner} from "../../../network/request";

import 'swiper/css';
import 'swiper/css/effect-fade';

export default defineComponent({
  name:'SwiperManage',
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {

    let swiperKey = ref(0)

    let banner = reactive({
      data:<string[]>[],
      tableData:<string[]>[],
      pageSize:<number>4
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

    const operationBanner = (row: { isShow: boolean; brand_id: number; })=>{
      operateBanner({
        isShow:row.isShow,
        id:row.brand_id
      }).then(res=>{
        if (res.data){
          banner.tableData.map((item:any)=>{
            if (item['brand_id'] === row.brand_id){
              item.isShow = res.data.operation_responsive
            }
          })

          //改变swiper组件的key值，刷新swiper组件
          swiperKey.value ++
        }
      })
    }

    onMounted(()=>{
      watchEffect(()=>{
        banner.tableData = sliceTableData(0,banner.pageSize)
      })
    })

    return {
      EffectCoverflow,
      swiperKey,
      banner,
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
</style>