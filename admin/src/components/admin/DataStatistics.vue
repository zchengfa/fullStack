<template>
  <div id="data-statistics"></div>
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
  name: "DataStatistics",
  setup(){
    onMounted(() =>{
      let chartDom =<HTMLElement>document.getElementById('data-statistics')
      let pieChart = echarts.init(chartDom)
      let option = {
        title:{
          text:'mall商品四季度销售图',
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
            center:["30%","30%"],
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
    })
  }
})
</script>

<style scoped>
#data-statistics{
  width: 100vw;
  height: 100vh;
}
</style>