<template>
<div class="detail-params">
  <div class="title"><h4>参数</h4></div>
  <div class="params-box">
    <div class="params" v-for="(item, index) in params" :key="index">{{item}}</div>
  </div>
</div>
</template>

<script>
export default {
  name: "DetailParams",
  props:{
    params:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
  .detail-params{
    margin: 0 auto;
    width: 96%;
  }
  .params-box{
    columns: 2;
    column-rule:thick outset orangered ;
    background-color: #ece6e6;
    box-shadow:2px 2px #e0dbdb;
  }
  .params{
    padding: .3rem;
    font-size: .9rem;
  }
</style>