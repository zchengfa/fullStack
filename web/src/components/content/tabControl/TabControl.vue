<template>
  <div class="tab-control">
    <div class="tab-control-item" v-for="(item, index) in title" :key="index" @click="itemClick(index)">
      <span :class="{active:currentIndex===index}">{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props:{
    title:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      currentIndex:0
    }
  },
  methods:{
    itemClick(index) {
      this.currentIndex = index

      //发送自定义事件以及要发送的数据，方便外部组件访问当前组件的数据
      this.$emit('tabClick', index)
    }
  }
}
</script>

<style scoped>
  .active{
    color: #FF69B4;
    border-bottom: .1rem solid #ff69b4;
  }
  .tab-control{
    display: flex;
    text-align: center;
    background-color: #fff;
  }
  .tab-control-item{
    flex: 1;
    height: 3rem;
    line-height: 3rem;
  }
  .tab-control-item span{
    padding: .8rem;
  }
</style>
