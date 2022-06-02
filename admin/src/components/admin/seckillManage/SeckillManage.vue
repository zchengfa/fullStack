<template>
 <div v-for="(item,index) in $props.seckillData" :key="index">{{item}}</div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "SeckillManage",
  props:['seckillData'],
  setup(props){
    console.log(props)
  }
})
</script>

<style scoped>

</style>