<template>
    <div id="pie-rose-chart"></div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, onUnmounted, reactive} from 'vue';
import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ToolboxComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const Charts = reactive<any>({
  myChart:null,
  chartDom:null
})

const resizeEcharts = (target:HTMLElement)=>{
  target.style.width = target.parentElement?.clientWidth + 'px'
  target.style.height = target.parentElement?.clientHeight + 'px'
}

const listener = ()=>{
  resizeEcharts((document.getElementById('earth')) as HTMLElement)
}

onMounted(() => {

    Charts.chartDom =<HTMLElement> document.getElementById('pie-rose-chart');
    if(echarts.getInstanceByDom(Charts.chartDom)) echarts.dispose(Charts.chartDom)

    resizeEcharts(Charts.chartDom)
    Charts.myChart = echarts.init(Charts.chartDom);
    let option;

    option = {
    legend: {
        show: false
    },
    toolbox: {
        show: false,
        feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
        }
    },
    series: [
        {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [10, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            data: [
                { value: 40, name: '女装' },
                { value: 38, name: '香水' },
                { value: 32, name: '童装' },
                { value: 30, name: '口红' },
                { value: 28, name: '鞋子' }
            ]
        }
    ]
    };
  Charts.myChart.setOption(option)
  window.addEventListener('resize',listener)
})

onBeforeUnmount(()=>{
  window.removeEventListener('resize',listener)
})
onUnmounted(()=>{
  Charts.myChart.dispose(Charts.chartDom);
})
</script>
<style scoped>
#pie-rose-chart{
  width: 100%;
  height: 100%;
}
</style>








