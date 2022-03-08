<template>
<div class="region">
  <div class="content">
    <div>
      <h4>所在地区</h4>
      <button @click="closeRegion">X</button>
    </div>
    <div class="region-content"></div>
  </div>
</div>
</template>

<script>
export default {
  name: "Region",
  methods:{
    closeRegion(){
      this.$emit('closeRegion')
    }
  }
}
</script>

<style scoped>
.region{

}
.content{
  background-color: #fff;
  text-align: center;
}
.region-content{
  margin-top: 10rem;
}
</style>