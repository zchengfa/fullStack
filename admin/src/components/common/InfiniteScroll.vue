<script setup lang="ts">
import {onUpdated,ref} from "vue";

defineProps({
  scrollData:{
    type:Array,
    default(){
      return []
    }
  },
  headerData:{
    type:Array,
    default(){
      return []
    }
  },
  propertyData:{
    type:Array,
    default(){
      return []
    }
  },
  speed:{
    type:Number,
    default(){
      return 20
    }
  }
})
const showContainerTwo = ref(false)
const rankMedal = (index:number)=>{
  const src = ['/src/assets/image/admin/gold_medal.png','/src/assets/image/admin/silver_medal.png','/src/assets/image/admin/bronze_medal.png']
  return src[index]
}

onUpdated(()=>{
  const con =<HTMLElement> document.getElementsByClassName('infinite-scroll-container').item(0)
  const el =<HTMLElement> document.getElementsByClassName('container-one').item(0)
  if(el?.clientHeight > con?.clientHeight){
    showContainerTwo.value = true
  }
})
</script>

<template>
<div class="infinite-scroll-container">
  <div class="scroll-header">
    <span class="scroll-h-item" v-for="(item,index) in headerData" :key="index">{{item}}</span>
  </div>
  <div class="scroll-container">
    <div class="container-item container-one" :class="showContainerTwo ? 'animate' : undefined" :style="{'--speed':speed+'s'}">
      <div v-for="(item,index) in scrollData" class="scroll-item" :key="index">
        <div class="No-box item-children">
          <span :class="{'rank-no':index<3}">{{index+1}}</span>
          <img v-if="index < 3" :src="rankMedal(index)" class="rank-medal"  alt="奖牌"/>
        </div>
        <span class="item-children" v-if="propertyData?.[0]">{{item[propertyData[0]]}}</span>
        <span class="item-children" v-if="propertyData?.[1]">{{item[propertyData[1]]}}</span>
        <span class="item-children" v-if="propertyData?.[2]">{{item[propertyData[2]]}}</span>
        <span class="item-children" v-if="propertyData?.[3]">{{item[propertyData[3]]}}</span>
      </div>
    </div>
    <div class="container-item container-two animate" v-if="showContainerTwo" :style="{'--speed':speed+'s'}">
      <div v-for="(item,index) in scrollData" class="scroll-item" :key="index">
        <div class="No-box item-children">
          <span :class="{'rank-no':index<3}">{{index+1}}</span>
          <img v-if="index < 3" :src="rankMedal(index)" class="rank-medal"  alt="奖牌"/>
        </div>
        <span class="item-children" v-if="propertyData?.[0]">{{item[propertyData[0]]}}</span>
        <span class="item-children" v-if="propertyData?.[1]">{{item[propertyData[1]]}}</span>
        <span class="item-children" v-if="propertyData?.[2]">{{item[propertyData[2]]}}</span>
        <span class="item-children" v-if="propertyData?.[3]">{{item[propertyData[3]]}}</span>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
@mixin flexLayout(){
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.scroll-container{
  width: 100%;
  height: 20rem;
  overflow: hidden;
  .rank-medal{
    width: 2rem;
    height: 2rem;
  }
  .No-box{
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .rank-no{
      position: absolute;
      left: 50%;
      top: 35%;
      transform: translate(-50%, -50%) scale(.8);
    }
  }
}
.scroll-header {
  @include flexLayout();
  .scroll-h-item{
    width: 25%;
  }
  .scroll-h-item:nth-child(2){
    width: 50%;
  }
}
.scroll-item{
  @include flexLayout();
  height: 4rem;
  .item-children{
    width: 25%;
  }
  .item-children:nth-child(2){
    width: 50%;
  }
}
.animate{
  animation: upAnimation var(--speed) linear infinite;
}
@keyframes upAnimation {
  0%{
    transform: translateY(0);
  }
  100%{
    transform: translateY(-100%);
  }
}

</style>
