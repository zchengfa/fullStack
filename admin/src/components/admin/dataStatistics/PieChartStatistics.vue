<template>
  <div id="pie-chart-statistics"></div>
</template>

<script lang="ts">
import {defineComponent,  reactive} from "vue";
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
  props:{
    salesData:{
      type:Array
    }
  },
  setup(props){
    let data = reactive({
      sales:props.salesData,
      pieKey:0
    })

    const setChart = ()=>{
      //获取dom
      let chartDom =<HTMLElement>document.getElementById('pie-chart-statistics')

      let pieChart = echarts.init(chartDom)

      //饼图配置项
      let option = {
        title:{
          text:'销量前十商品类型',
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
            name: '销量前四商品类型',
            type: 'pie',
            radius: '50%',
            data: data.sales,
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
    }

    onMounted(() =>{
      setChart()
    })
  }
})
</script>

<style scoped>
#pie-chart-statistics{
  width: 40rem;
  height: 20rem;
  border: 1px solid #a29d9d;
  background-color: #FFFFFF;
}
</style>