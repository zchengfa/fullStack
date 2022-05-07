<template>
  <div class="data-summary">
    <div class="item info-summary">
      <h5>平台信息数据统计</h5>
      <div class="info-data">
        <div class="member data-item">
          <div class="image-box">
            <img src="../../../assets/image/member.png" alt="image">
          </div>
          <div class="data">
            <p>会员数量</p>
            <span>454人</span>
          </div>
        </div>
        <div class="goods data-item">
          <div class="image-box">
            <img src="../../../assets/image/goods.png" alt="image">
          </div>
          <div class="data">
            <p>商品数量</p>
            <span>5272件</span>
          </div>
        </div>
        <div class="store data-item">
          <div class="image-box">
            <img src="../../../assets/image/store.png" alt="image">
          </div>
          <div class="data">
            <p>店铺数量</p>
            <span>24家</span>
          </div>
        </div>
      </div>
    </div>
    <div class="item delivery">
      <h5>物流运营状态</h5>
      <div class="status-box">
        <p>订单统计</p>
        <div>
          <p>4543</p>
          <span>正在运输</span>
        </div>
        <div>
          <p  class="finish-count">4448</p>
          <span class="finish">已完成的订单</span>
        </div>
      </div>
      <div class="status-box">
        <p>仓库统计</p>
        <div>
          <p>58</p>
          <span>已开通海外仓卖家</span>
        </div>
        <div>
          <p  class="finish-count">8448</p>
          <span class="finish">海外仓总数</span>
        </div>
      </div>
    </div>
    <div class="item">
      <PieChartStatistics></PieChartStatistics>
    </div>
    <div class="item bar-summary">
      <BarChartStatistics></BarChartStatistics>
    </div>
    <div class="item">
<!--      <UserLocationChartStatistics></UserLocationChartStatistics>-->
    </div>
  </div>
  <div class="rank">
    <div class="gold-user-rank">
      <h5>用户消费排行榜</h5>
      <div class="title">
        <span>排名</span>
        <span>用户</span>
        <span>消费</span>
      </div>
      <div class="consumption">
        <div class="rank-item" v-for="(item,index) in rank.userConsumption" :key="index">
          <div>
            <span>{{index+1}}</span>
            <span v-show="item['username']">{{item['username']}}</span>
            <span v-show="!item['username']">{{item['account']}}</span>
            <span>{{item['totalConsumption']}}</span>
          </div>
          <progress-bar :progress="Math.round(Math.random()*90)" :item='index'></progress-bar>
        </div>
      </div>
      <div class="none-rank" v-show="rank.userConsumption.length">暂无用户上榜</div>
    </div>
    <div class="product-sales-rank">
      <h5>商品销量排行榜</h5>
      <div class="title">
        <span>排名</span>
        <span>商品类型</span>
        <span>销量</span>
        <span>总金额</span>
      </div>
      <div class="none-rank" v-show="false">暂无用户上榜</div>
    </div>
    <div class="keyword-search-rank">
      <h5>关键词搜索排行榜</h5>
      <div class="title">
        <span>排名</span>
        <span>关键词</span>
        <span>搜索次数</span>
      </div>
      <div class="none-rank" v-show="false">暂无用户上榜</div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive} from "vue";
import PieChartStatistics from "./PieChartStatistics.vue";
import BarChartStatistics from "./BarChartStatistics.vue";
import UserLocationChartStatistics from "./UserLocationChartStatistics.vue";
import {ElIcon,ElButton} from 'element-plus'
import {Warning} from '@element-plus/icons-vue'
import ProgressBar from '../../common/ProgressBar.vue'
import {getStatisticsData} from '../../../network/request'

export default defineComponent({
  name: "DataStatistics",
  components:{
    Warning,
    ElButton,
    PieChartStatistics,
    BarChartStatistics,
    UserLocationChartStatistics,
    ProgressBar
  },
  setup(){
    onBeforeMount(()=>{
      getSData()
    })

    let rank = reactive({
      userConsumption:<string[]>[]
    })

    //获取统计所需要的数据
    function getSData(){
      getStatisticsData().then(res=>{
        rank.userConsumption = res.data[0].userConsumption
      })
    }

    return {
      rank
    }
  }
})
</script>

<style scoped>
.data-summary{
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  flex-wrap: wrap;
  float: left;
  width: 80%;
  height: 100%;
  overflow-y: scroll;
}
.data-summary div{
  border-radius: .2rem;
}
.data-summary::-webkit-scrollbar{
  display: none;
}
.data-summary .item{
  margin: 0 auto 2vh;
  width: 98%;
  height: 40vh;
  text-align: center;
}
.data-summary .item:first-child{
  height: 16vh;
  background-color: #fff;
  letter-spacing: .1rem;
}
.item h5{
  padding: .5rem;
  margin: 0;
  text-align: left;
}
.data-summary .bar-summary{
  height: 50vh;
}
.item.info-summary h5{
  background-color: rgb(242, 236, 247);
}
.info-data{
  display: flex;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.info-data div{
  margin: 0 auto;
  width: 30%;
  height: 70%;
}
.info-data .data-item{
  display: flex;
  justify-items: center;
  align-items: center;
}
.info-data .data-item:nth-child(2){
  border-left: 2px solid #e51313;
  border-right: 2px solid #ea1414;
}
.data-item div:first-child{
  margin-right: 0;
}
.data-item div:last-child{
  margin-left: 0;
}
.data-item div p{
  margin: 0 auto 1rem;
}
.info-data .image-box{
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  border-radius: 50%;
}
.info-data img{
  position: relative;
  margin-top: 50%;
  width: 2rem;
  transform: translateY(-50%);
}
.delivery{
  /*color: #FFFFFF;*/
  /*background-color: rgba(0, 0, 0, 0.7);*/
}
.data-summary .delivery{
  height: 30vh;
}
.delivery .status-box{
  position: relative;
  width: 48%;
  height: 80%;
  float: left;
  background-color: #fff;
}
.delivery .status-box:last-child{
  float: right;
}
.status-box div{
  display: inline-block;
  width: 48%;
}
.status-box div:last-child{
  border-left: 1px solid #fff;
}
.status-box p{
  text-indent: 1rem;
  text-align: left;
}
.status-box span{
  display: inline-block;
}
.status-box span::before{
  display: inline-block;
  margin-right: 1rem;
  content: '';
  width: .5rem;
  height: .5rem;
  background-color: red;
  border-radius: 50%;
}
.status-box .finish::before{
  background-color: #578314;
}
.status-box div p{
  margin-bottom: .5rem;
  font-weight: bold;
  font-size: 1.4rem;
  color: red;
  text-align: center;
  text-indent: unset;
}
.status-box .finish-count{
  color: #507020;
}
.rank{
  float: right;
  width: 20%;
  height: 100%;
  background-color: #fff;
  overflow-y: scroll;
}
.rank div{
  margin: 0 auto 2vh;
  width: 96%;
  height: 50%;

  overflow-y: scroll;
}
.rank h5{
  margin: 0 auto;
  padding: 4%;
  background-color: rgb(242, 236, 247);
}
.rank::-webkit-scrollbar,
.rank div::-webkit-scrollbar{
  display: none;
}
.rank .title{
  width: 100%;
  height: 10%;
  min-height: 32px;
  background-color: #fff;
}
.product-sales-rank .title span{
  width: 25%;
}
.title span{
  position: relative;
  top: 50%;
  display: inline-block;
  width: 33%;
  font-size: xx-small;
  font-weight: bold;
  text-align: center;
  transform: translateY(-50%);
}
.rank-item span{
  display: inline-block;
  text-align: center;
}
.none-rank{
  position: relative;
  top:50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #8a8686;
}
</style>