<template>
  <div id="user-location-chart-statistics"></div>
</template>

<script lang="ts">
import {defineComponent,onMounted} from "vue";
import * as echarts from 'echarts/core';
import 'echarts/extension/bmap/bmap'
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption
} from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  ScatterChart,
  EffectScatterChart,
  CanvasRenderer,
  UniversalTransition
]);

type EChartsOption = echarts.ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | ScatterSeriesOption
    | EffectScatterSeriesOption
    >;

import customMapJson from '../../../assets/custom_map.json'
export default defineComponent({
  name: "UserLocationChartStatistics",
  setup(){
    onMounted(()=>{
      let chartDom =<HTMLElement>document.getElementById('user-location-chart-statistics')
      let locationChart = echarts.init(chartDom)
      interface DataItem {
        name:string,
        value:number
      }

      let citySize : DataItem[]= [
        {
          name:'深圳',
          value:200
        },
        {
          name:'江西',
          value:100
        }
      ]

      let cityLocation : Record<string, number[]> = {
        '深圳':[114.2,22.5],
        '江西':[124.2,10.5]
      }
      const convertData = function (data: DataItem[]) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let geoCord = cityLocation[data[i]['name']];
          if (geoCord) {
            res.push({
              name: data[i].name,
              value: geoCord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      let option:EChartsOption = {
        title: {
          text: 'mall项目使用者分布图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        bmap: {
          center: [70, 51.915],
          zoom: 5.5,
          roam: true,
          mapStyle: {
            styleJson:customMapJson
          }
        },
        series: [
          {
            name: 'location',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: convertData(citySize),
            symbolSize: function (val) {
              return val[2] / 10;
            },
            encode: {
              value: 2
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: convertData(
                citySize
                    .sort(function (a:any, b:any) {
                      return b.value - a.value;
                    })
                    .slice(0, 6)
            ),
            symbolSize: function (val) {
              return val[2] / 10;
            },
            encode: {
              value: 2
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            },
            emphasis: {
              scale: true
            },
            zlevel: 1
          }
        ]
      };

      option && locationChart.setOption(option);
      //让图表的大小根据窗口大小改变而改变
      window.addEventListener('resize',()=>{
        locationChart.resize()
      })
    })
  }
})
</script>

<style scoped>
#user-location-chart-statistics{
  margin: 0 auto;
  width: 50vw;
  height: 60vh;
  border: 1px solid #a9a9a9;
  background-color: #FFFFFF;
}
</style>

