<template>
  <div id="pie-chart-statistics"></div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";

import {PieChart} from "echarts/charts";
import {LabelLayout} from "echarts/features";
import {CanvasRenderer} from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout,
  CanvasRenderer]
)
import {onMounted} from "vue";

export default defineComponent({
  name: "PieChartStatistics",
  setup(){
    onMounted(() =>{
      //获取dom
      let chartDom =<HTMLElement>document.getElementById('pie-chart-statistics')
      let pieChart = echarts.init(chartDom)
      //饼图配置项
      let option = {
        title:{
          text:'四季度销售图',
          left:'center'
        },
        tooltip:{
          trigger:'item'
        },
        legend:{
          orient:'vertical',
          left: 'left'
        },
        series:[
          {
            name: '四季度销售量',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '春季' },
              { value: 735, name: '夏季' },
              { value: 580, name: '秋季' },
              { value: 484, name: '冬季' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      pieChart.setOption(option)

      //让图表的大小根据窗口大小改变而改变
      window.addEventListener('resize',()=>{
        pieChart.resize()
      })
    })
  }
})
</script>

<style scoped>
#pie-chart-statistics{
  width: 40vw;
  height: 40vh;
  border: 1px solid #a29d9d;
  background-color: #FFFFFF;
}
</style>