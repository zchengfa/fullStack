<template>
  <div class="data-statistics">
    <pie-chart-statistics class="pie"></pie-chart-statistics>
    <BarChartStatistics class="bar"></BarChartStatistics>
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
.pie,.bar{
  display: inline-block;
  margin: 1rem;
}
</style>