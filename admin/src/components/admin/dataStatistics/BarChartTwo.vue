<template>
    <div id="bar-chart-two"></div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, reactive} from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
>;
const Charts = reactive({
  myChart:<any>null,
  chartDom:<any>null
})

const resizeEcharts = (target:HTMLElement)=>{
  target.style.width = target.parentElement?.clientWidth + 'px'
  target.style.height = target.parentElement?.clientHeight + 'px'
}
onMounted(() => {
    Charts.chartDom = document.getElementById('bar-chart-two')!;
    if (echarts.getInstanceByDom(Charts.chartDom)) echarts.dispose(Charts.chartDom);
    resizeEcharts(Charts.chartDom)
    Charts.myChart = echarts.init(Charts.chartDom);
    let option: EChartsOption;

    let xAxisOneData = (()=>{
        let now = new Date()
        let result = []
        let len = 100
        while (len --){
          result.unshift(now.toLocaleTimeString().replace(/\D*/,''))
          now = new Date(+now -2000)
        }
        return result
      })()
    let seriesOneData:any[] = []
    let seriesTwoData:any[] = []
    for (var i = 0; i < 100; i++) {

        seriesOneData.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        seriesTwoData.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }
    option = {
        title: {
            text: '订单实时走势',
            textStyle:{
                color:'#65accd'
            }
        },
        legend: {
            data: ['新增订单数', '退单数'],
            textStyle:{
                color:'red'
            },
            top: 'bottom'
        },
        toolbox: {
            show:false
        },
        tooltip: {},
        xAxis: {
            data: xAxisOneData,
            splitLine: {
                show: false
            }
        },
        yAxis: {},
        series: [
            {
                name: '新增订单数',
                type: 'bar',
                data: seriesOneData,
                emphasis: {
                    focus: 'series'
                },
                animationDelay: function (idx) {
                    return idx * 10;
                },
                itemStyle:{
                    color:'rgb(200 58 235)'
                }
            },
            {
                name: '退单数',
                type: 'bar',
                data: seriesTwoData,
                emphasis: {
                    focus: 'series'
                },
                animationDelay: function (idx) {
                    return idx * 10 + 100;
                },
                itemStyle:{
                    color:'rgb(21 210 222)'
                }
            }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx:any) {
            return idx * 5;
        }
    };

    //设置定时器，每过2秒就刷新一次数据并将新数据加入到图表中
    setInterval(()=>{
        let xAxisData = new Date().toLocaleTimeString().replace(/\D*/,'')
        let i = Math.round(Math.random()*100)
        //先删除原先数组中第一个数据
        xAxisOneData.shift()

        //将新数据加入到数组的最后
        xAxisOneData.push(xAxisData)

        seriesOneData.shift()
        seriesTwoData.shift()
        seriesOneData.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        seriesTwoData.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);

        //重新配置图表数据
        Charts.myChart.setOption({
          xAxis:[
            {
              data:xAxisOneData
            }
          ],
          series:[
            {
              data:seriesOneData
            },
            {
              data: seriesTwoData
            }
          ]
        })
      },2100)
  Charts.myChart.setOption(option)

  window.addEventListener('resize',()=>{
    Charts.myChart.resize({
      width: document.getElementById('bar-chart-two')?.parentElement?.clientWidth,
      height: document.getElementById('bar-chart-two')?.parentElement?.clientHeight,
      animation: {
        duration: 300,
        easing: 'linear',
      }
    })
  })
})

onBeforeUnmount(()=>{
  window.onresize = null;
})
</script>



