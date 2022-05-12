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
    <div class="item pie-summary">
      <PieChartStatistics class="pie"></PieChartStatistics>
      <div class="circle-box">
        <progress-bar class="circle-bar" bar-type="circle" :progress="100"  :item="0"
                      circle-border-color="#cd9cf2"
                      circle-text-color="red"
                      mask-color="pink"
                      circle-progress-color="#b8cbb8">

        </progress-bar>
      </div>
    </div>
    <div class="item bar-summary">
      <BarChartStatistics></BarChartStatistics>
    </div>
    <div class="item">
      <UserLocationChartStatistics></UserLocationChartStatistics>
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
      <div class="consumption rank-box" v-if="rank.userConsumption.length">
        <div class="rank-item" v-for="(item,index) in rank.userConsumption" :key="index">
          <div>
            <span>{{index+1}}</span>
            <span v-show="item['username']">{{item['username']}}</span>
            <span v-show="!item['username']">{{dealUserPhoneNumber(item['account'])}}</span>
            <span>{{dealBigNumber(item['totalConsumption'])}}</span>
          </div>
          <progress-bar class="rank-bar" :progress="item['percent']" :item='index'></progress-bar>
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
          <div>
            <span>{{index+1}}</span>
            <span>{{item['type']}}</span>
            <span>{{dealBigNumber(item['sales'])}}</span>
            <span>{{dealBigNumber(item['consumption'])}}</span>
          </div>
          <progress-bar class="rank-bar" :progress="item['percent']" :item='index+rank.userConsumption.length'></progress-bar>
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
          <div>
            <span>{{index+1}}</span>
            <span>{{item['word']}}</span>
            <span>{{dealBigNumber(item['search_count'])}}</span>
          </div>
          <progress-bar class="rank-bar" :progress="item['percent']" :item='index+rank.userConsumption.length+rank.productSales.length'></progress-bar>
        </div>
      </div>
      <div class="none-rank" v-else>暂无用户上榜</div>
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
      userConsumption:<string[]>[],
      productSales:<string[]>[],
      words:<string[]>[]
    })

    //获取统计所需要的数据
    function getSData(){
      getStatisticsData().then(res=>{
        rank.userConsumption = dealPercent(res.data[0].userConsumption,'totalConsumption')
        rank.productSales = dealPercent(res.data[1].productSales,'sales')
        rank.words = dealPercent(res.data[2].words,'search_count')
      })
    }

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
      dealUserPhoneNumber
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
  width: 40vw;
  height: 40vh;
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
.pie-summary .pie{
  float: left;
}
.pie-summary .circle-bar{
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
.rank .gold-user-rank,
.rank .product-sales-rank,
.rank .keyword-search-rank{
  position: relative;
  margin: 0 auto 2vh;
  width: 96%;
  height: 50%;
}
.rank-box{
  height: 80%;
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
.rank-item{
  margin: 2vh auto;
}
.rank-item .rank-bar{
  width: 86%;
  margin: 1vh auto;
}
.rank-item span{
  display: inline-block;
  text-align: center;
  width: 25%;
  font-size: 12px;
  color: #8a8686;
}
.rank-item:first-child div:first-child span:first-child{
  font-size: 20px;
  color: #ea1f1f;
  font-weight: bolder;
}
.rank-item:nth-child(2) div:first-child span:first-child{
  font-size: 18px;
  color: #2121d2;
  font-weight: bold;
}
.rank-item:nth-child(3) div:first-child span:first-child{
  font-size: 16px;
  color: #cc5a1d;
}
.consumption .rank-item span,
.keywords .rank-item span{
  width: 33%;
}
.none-rank{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  color: #8a8686;
}
.item.pie-summary div{
  display: inline-block;
}
.circle-box{
  height: 100%;
}
.circle-bar{
  position: relative;
  top:50%;
  width: 10vw;
  height: 10vw;
  transform: translateY(-50%);
}
</style>