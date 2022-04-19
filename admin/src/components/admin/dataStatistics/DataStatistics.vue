<template>
  <div class="data-statistics">
    <div class="summary">1</div>
    <pie-chart-statistics class="pie"></pie-chart-statistics>
    <BarChartStatistics class="bar"></BarChartStatistics>
    <div>4</div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PieChartStatistics from "./PieChartStatistics.vue";
import BarChartStatistics from "./BarChartStatistics.vue";

export default defineComponent({
  name: "DataStatistics",
  components:{
    PieChartStatistics,
    BarChartStatistics
  }
})
</script>

<style scoped>
.data-statistics{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-items: center;
  background-color: #212020;
  overflow: hidden;
}
.summary{
  width: 600px;
  background-color: red;
  height: 400px;
}
</style>