<template>
  <el-row>
    <el-col class="monitor-col">
      <div class="data-summary">
        <div class="item visitor-summary">
          <h5>项目流量统计</h5>
          <div class="visitor-boxes item-content">
            <div class="today-visitor visitor-box">
              <p>今日访客</p>
              <span>{{total_visC.todayVis}}人</span>
            </div>
            <div class="total-visitor visitor-box">
              <p>累计访客</p>
              <span>{{rank.visitorCount}}人</span>
            </div>
            <div class="total-visC visitor-box">
              <p>总访问次数</p>
              <span>{{rank.totalVisCount}}次</span>
            </div>
          </div>
        </div>
        <div class="item info-summary">
          <h5>平台信息数据统计</h5>
          <div class="info-data item-content">
            <div class="member data-item">
              <div class="image-box">
                <img src="../../../assets/image/member.png" alt="image">
              </div>
              <div class="data">
                <p>会员数量</p>
                <span>{{ rank.users }}人</span>
              </div>
            </div>
            <div class="goods data-item">
              <div class="image-box">
                <img src="../../../assets/image/goods.png" alt="image">
              </div>
              <div class="data">
                <p>商品数量</p>
                <span>{{ rank.goods }}件</span>
              </div>
            </div>
            <div class="store data-item">
              <div class="image-box">
                <img src="../../../assets/image/store.png" alt="image">
              </div>
              <div class="data">
                <p>店铺数量</p>
                <span>1家</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item delivery clearfix">
          <h5>物流运营状态</h5>
          <div class="status-box">
            <p>订单统计</p>
            <div>
              <p>{{rank.order_not_finish}}</p>
              <span>未完成的订单</span>
            </div>
            <div>
              <p  class="finish-count">{{rank.order_finished}}</p>
              <span class="finish">已完成的订单</span>
            </div>
          </div>
          <div class="status-box">
            <p>仓库统计</p>
            <div>
              <p>0</p>
              <span>已开通海外仓卖家</span>
            </div>
            <div>
              <p  class="finish-count">0</p>
              <span class="finish">海外仓总数</span>
            </div>
          </div>
        </div>
        <div class="item pie-summary">
          <!--      添加v-if判断，当数据请求完之后在去渲染图表-->
          <PieChartStatistics v-if="rank.salesData.length" class="pie" :sales-data="rank.salesData"></PieChartStatistics>
          <div class="circle-box">
            <!--        添加v-if在百分比计算完成后并且不等于0时渲染-->
<!--            <progress-bar v-if="rank.percent" class="circle-bar" bar-type="circle" label="用户转化率" :progress="rank.percent"  :item="0"-->
<!--                          circle-border-color="#cd9cf2"-->
<!--                          circle-text-color="red"-->
<!--                          mask-color="pink"-->
<!--                          circle-progress-color="#8a8686">-->

<!--            </progress-bar>-->
            <circle-progress v-if="rank.percent" label="用户转化率" class="circle-pro" :percent="rank.percent"></circle-progress>
            <circle-progress v-if="rank.percent" label="成交率" class="circle-pro" container-b-g="#bababa" center-b-g="#000" semicircle-b-g="#fff" item="1" :percent="90"></circle-progress>
          </div>
        </div>
        <div class="item bar-summary">
          <BarChartStatistics></BarChartStatistics>
          <div class="circle-pro-boxes">
            <circle-progress v-if="rank.percent" label="退货率" container-b-g="#bababa" center-b-g="#000" semicircle-b-g="#fff" item="2" class="circle-pro-two circle-boxes-item" :percent="30"></circle-progress>
            <circle-progress v-if="rank.percent" label="售后率" container-b-g="rgb(215 215 71)" center-b-g="rgb(33 171 192)" semicircle-b-g="#fff" item="3" class="circle-pro-three circle-boxes-item" :percent="65"></circle-progress>
            <circle-progress v-if="rank.percent" label="满意率" container-b-g="rgb(217 106 132)" center-b-g="rgb(121 106 217)" semicircle-b-g="#fff" item="4" class="circle-pro-four circle-boxes-item" :percent="79"></circle-progress>
          </div>
        </div>
        <!--    <div class="item">-->
        <!--      <UserLocationChartStatistics></UserLocationChartStatistics>-->
        <!--    </div>-->
      </div>
      <div class="rank">
        <div class="gold-user-rank">
          <h5>用户消费排行榜</h5>
          <div class="title">
            <span>排名</span>
            <span>用户</span>
            <span>消费</span>
          </div>
          <div class="consumption rank-box" v-if="rank.userConsumption.length">
            <div class="rank-item" v-for="(item,index) in rank.userConsumption" :key="index">
              <div class="rank-other">
                <div class="No-box">
                  <span :class="{'rank-no':index<3}">{{index+1}}</span>
                  <img v-if="index < 3" :src="rankMedal(index)" class="rank-medal"  alt="奖牌"/>
                </div>
                <span v-show="item['username']">{{item['username']}}</span>
                <span v-show="!item['username']">{{dealUserPhoneNumber(item['account'])}}</span>
                <span>{{dealBigNumber(item['totalConsumption'])}}</span>
              </div>
              <circle-progress class="rank-bar" progress-type="normal" :percent="item['percent']" :item='index'></circle-progress>

              <!--              <progress-bar class="rank-bar" :progress="item['percent']" :item='index'></progress-bar>-->
            </div>
          </div>
          <div class="none-rank" v-else>暂无用户上榜</div>
        </div>
        <div class="product-sales-rank">
          <h5>商品销量排行榜</h5>
          <div class="title">
            <span>排名</span>
            <span>商品类型</span>
            <span>销量</span>
            <span>总金额</span>
          </div>
          <div class="sales rank-box" v-if="rank.productSales.length">
            <div class="rank-item" v-for="(item,index) in rank.productSales" :key="index">
              <div class="rank-other">
                <div class="No-box">
                  <span :class="{'rank-no':index<3}">{{index+1}}</span>
                  <img v-if="index < 3" :src="rankMedal(index)" class="rank-medal"  alt="奖牌"/>
                </div>
                <span>{{item['type']}}</span>
                <span>{{dealBigNumber(item['sales'])}}</span>
                <span>{{dealBigNumber(item['consumption'])}}</span>
              </div>
              <circle-progress class="rank-bar" progress-type="normal" :percent="item['percent']" :item='index+rank.userConsumption.length'></circle-progress>
<!--              <progress-bar class="rank-bar" :progress="item['percent']" :item='index+rank.userConsumption.length'></progress-bar>-->
            </div>
          </div>
          <div class="none-rank" v-else>暂无用户上榜</div>
        </div>
        <div class="keyword-search-rank">
          <h5>关键词搜索排行榜</h5>
          <div class="title">
            <span>排名</span>
            <span>关键词</span>
            <span>搜索次数</span>
          </div>
          <div class="keywords rank-box" v-if="rank.words.length">
            <div class="rank-item" v-for="(item,index) in rank.words" :key="index">
              <div class="rank-other">
                <div class="No-box">
                  <span :class="{'rank-no':index<3}">{{index+1}}</span>
                  <img v-if="index < 3" :src="rankMedal(index)" class="rank-medal"  alt="奖牌"/>
                </div>
                <span>{{item['word']}}</span>
                <span>{{dealBigNumber(item['search_count'])}}</span>
              </div>
              <circle-progress class="rank-bar" progress-type="normal" :percent="item['percent']" :item='index+rank.userConsumption.length+rank.productSales.length'></circle-progress>
<!--              <progress-bar class="rank-bar" :progress="item['percent']" :item='index+rank.userConsumption.length+rank.productSales.length'></progress-bar>-->
            </div>
          </div>
          <div class="none-rank" v-else>暂无用户上榜</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {defineComponent, reactive,computed} from "vue";
import PieChartStatistics from "./PieChartStatistics.vue";
import BarChartStatistics from "./BarChartStatistics.vue";
import UserLocationChartStatistics from "./UserLocationChartStatistics.vue";
import {ElButton} from 'element-plus'
import {Warning} from '@element-plus/icons-vue'
import ProgressBar from '../../common/ProgressBar.vue'
import {getStatisticsData} from '../../../network/request'
import CircleProgress from "../../common/CircleProgress.vue";
import { shopStore } from "../../../pinia/pinia";

export default defineComponent({
  name: "DataStatistics",
  components:{
    Warning,
    ElButton,
    PieChartStatistics,
    BarChartStatistics,
    UserLocationChartStatistics,
    ProgressBar,
    CircleProgress
  },
  setup(){

    let rank = reactive({
      userConsumption:<any[]>[],
      productSales:<any[]>[],
      words:<any[]>[],
      goods:<number>0,
      users:<number>0,
      visitor:<string[]>[],
      visitorCount:<number>0,
      order_finished:<number>0,
      order_not_finish:<number>0,
      totalVisCount:<number>0,
      percent:<number>0,
      salesData:<string[]>[]
    })

    const total_visC = computed(()=>{

      let todayVis = 0
      let year = new Date().getFullYear()
      let month:number | string = new Date().getMonth()+1
      let day:number | string = new Date().getDay()
      if ( month < 10) {
        month = '0'+ month
      }
      if ( day < 10){
        day = '0'+ day
      }
      let today = year+'-'+month+'-'+day
      rank.visitor.map((item:any)=>{
        if (today === item.time){
          todayVis ++
        }
      })

      return {
        'todayVis':todayVis
      }
    })

    //返回对应的奖牌
    const rankMedal = (index:number)=>{
      const src = ['/src/assets/image/admin/gold_medal.png','/src/assets/image/admin/silver_medal.png','/src/assets/image/admin/bronze_medal.png']
      return src[index]
    }

    //获取统计所需要的数据
    function getSData(){
      getStatisticsData().then(res=>{
        rank.userConsumption = dealPercent(res.data[0].userConsumption,'totalConsumption')
        rank.productSales = dealPercent(res.data[1].productSales,'sales')
        rank.words = dealPercent(res.data[2].words,'search_count')
        rank.goods = res.data[3].total_goods
        rank.users = res.data[3].total_user
        rank.visitor = res.data[3].visitor
        rank.visitorCount = rank.visitor.length
        rank.order_finished = res.data[3].order_finished
        rank.order_not_finish = res.data[3].order_not_finish
        rank.visitor.map((item:any)=>{
          rank.totalVisCount += item.count
        })
        rank.percent = Math.round((rank.visitorCount/rank.totalVisCount)*100)
        rank.salesData = res.data[4].sales
      })
    }
    getSData()

    //处理较大的数字
    function dealBigNumber(num:number){
      let numString:string = num.toString()

      //判断数字中是否含有小数点
      if (numString.indexOf('.')!==-1){
        //有小数点，截取小数点前的所有数字
        let subStringNum:string = numString.substr(0,numString.indexOf('.'))
        return returnNum(subStringNum)
      }
      else{
        return returnNum(numString)
      }

      function returnNum(subStringNum:string){
        let numLength:number = subStringNum.length
        if (numLength>=6&&numLength<9){
          let thousandsString:string = (Number(subStringNum)/10000).toString().substring(0,(Number(subStringNum)/10000).toString().indexOf('.'))
          return thousandsString + '万+'
        }
        else if (numLength>=9){
          let hundredMillion:string = (Number(subStringNum)/100000000).toString().substring(0,(Number(subStringNum)/100000000).toString().indexOf('.'))
          return hundredMillion + '亿+'
        }
        else {
          return num
        }
      }
    }

    //处理用户的手机号码
    function dealUserPhoneNumber(tel:number){
      let telNum:number = tel.toString().length
      if (telNum!==11){
        throw new Error('your telephone number is illegal')
      }
      else{
        return tel.toString().replace(tel.toString().substr(3,4),'****')
      }
    }

    //处理进度条的百分比
    function dealPercent(arr:string[],dealArg:any){
      let total:number = 0
      arr.map(item=>{
        total += Number(item[dealArg])
      })

      arr.map((item:any)=>{
        item['percent'] = (item[dealArg]/total)*100
        item['percent'] = Math.round(Number(Number(item['percent']).toFixed(2)))
      })
      return arr
    }

    return {
      rank,
      dealBigNumber,
      dealUserPhoneNumber,
      total_visC,
      rankMedal
    }
  }
})
</script>

<style scoped lang="scss">
.clearfix::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
}
.monitor-col{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: calc(100vh - 140px);
  overflow-y: scroll;
  .data-summary{
    padding: 1rem;
    flex: 1;
    .item h5{
      padding: 1rem 0;
      text-align: left;
      border-radius: .2rem;
      background-color: rgb(242, 236, 247);
      box-shadow: rgb(174, 172, 176) 4px 4px 2px 2px;
    }
    .item .item-content{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .visitor-box,.data-item{
      flex:1;
      padding: 2rem 0;
      border-radius: .5rem;
      color: #fff;
    }
    .data-item{
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      color: #000;
      .image-box{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        img{
          width: 2rem;
          height: 2rem;
        }
      }
    }
    .goods{
      border-left: 2px solid #c54ce7;
      border-right: 2px solid #c54ce7;
    }
    .today-visitor{
      background-color: red;
      box-shadow: #e58f8f 10px 10px 3px 3px;
    }
    .total-visitor{
      margin: 0 1rem;
      background-color: #0d84ff;
      box-shadow: #85bfe5 10px 10px 3px 3px;
    }
    .total-visC{
      background-color: #d48a1b;
      box-shadow: #e0c6a3 10px 10px 3px 3px;
    }
  .status-box{
    box-sizing: border-box;
    padding: 1rem;
    float: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    div{
      padding: 2rem;
    }
  }
    .pie-summary{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 0;
      .pie{
        width: 100%;
        height: 100%;
      }
      .circle-box{
        position: relative;
        flex: 1;
        height: 20rem;
      }
      .circle-pro{
        width: 7rem;
        height: 7rem;
      }
      .circle-pro:first-child{
        position: absolute;
        left: 2rem;
        top: 2rem;
      }
      .circle-pro:last-child{
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    .item{
      position: relative;
    }
    .bar-summary{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      .circle-pro-boxes{
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        .circle-boxes-item{
          width: 6rem;
          height: 6rem;
          margin-left: 3rem;
          margin-top: 3rem;
        }
      }
    }
  }
  .rank{
    padding: 1rem;
    min-width: 200px;
    font-size: .8rem;
    height: 100%;
    border-radius: .2rem;
    background-color: rgb(242, 236, 247);
    overflow-y: scroll;
    .rank-bar{
      width: 100%;
      height: .6rem;
    }
    h5{
      font-size: .9rem;
      border-radius: .1rem;
      box-shadow: rgb(174, 172, 176) 4px 4px 2px 2px;
    }
    .title,.rank-other{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .8rem;
    }
    .title{
      font-weight: bold;
      span{
        min-width: 2rem;
      }
    }
    .rank-other{
      span{
        min-width: 2rem;
        font-size: .8rem;
      }
      span:first-child{
        font-weight: bold;
      }
    }
    .No-box{
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      span.rank-no{
        position: absolute;
        height: 100%;
        line-height: 1.6rem;
        z-index:1;
        color: #fff;
        transform: scale(.8);
      }
      .rank-medal{
        width: 2rem;
        height: 2rem;
        transform: scale(.8);
      }
    }
    .rank-other{
      padding: 1rem 0;
    }
    .none-rank{
      padding: 2rem;
      color: #8a8a8a;
    }
  }
}
</style>
