<script setup>
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GlobeComponent } from "echarts-gl/components";
import {onBeforeUnmount, onMounted} from "vue";
const ROOT_PATH = 'https://echarts.apache.org/examples';
echarts.use([GlobeComponent, CanvasRenderer]);

const resizeEcharts = (target)=>{
  target.style.width = target.parentElement?.clientWidth + 'px'
  target.style.height = target.parentElement?.clientHeight + 'px'
}

onMounted(()=>{

  let chartDom = document.getElementById('earth');
  resizeEcharts(chartDom)
  let myChart = echarts.init(chartDom);
  let option;

  option = {
    backgroundColor: 'transparent',
    globe: {
      baseTexture: '/src/assets/image/world.topo.bathy.200401.jpg',
      heightTexture: '/src/assets/image/world.topo.bathy.200401.jpg',
      displacementScale: 0.04,
      shading: 'realistic',
      environment: '/src/assets/image/starfield.jpg',
      realisticMaterial: {
        roughness: 0.9
      },
      postEffect: {
        enable: true
      },
      light: {
        main: {
          intensity: 5,
          shadow: true
        },
        ambientCubemap: {
          texture: '/src/assets/pisa.hdr',
          diffuseIntensity: 0.2
        }
      }
    }
  };

  option && myChart.setOption(option);

  window.addEventListener('resize',()=>{
    myChart.resize({
      width: document.getElementById('earth').parentElement?.offsetWidth,
      height: document.getElementById('earth').parentElement?.offsetHeight,
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

<template>
  <div id="earth"></div>
</template>

<style scoped>
#earth{
  width: 100%;
  height: 100%;
}
</style>
