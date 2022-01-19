<template>
<div class="filter-bar-container">
 <div class="filter-bar-item" v-for="(item,index) in list" :key="item+index" @click="filterData(index)">
   <div :class="{'active':currentIndex===index}">{{item}}</div>
   <div class="item-icon-container">
     <i class="filter-icon" :class="{'filter-icon-up':isUp&&currentIndex===index,'filter-icon-down':isDown&&currentIndex===index}" v-show="index ===0 || index === 1"></i>
   </div>
 </div>
</div>
</template>

<script>
export default {
  name: "FilterBar",
  data(){
    return {
      list:['价格','折扣','销量','筛选'],
      isUp:false,
      isDown:false,
      clickCount:0,
      currentIndex:-1
    }
  },
  methods:{
    filterData(index){
      this.currentIndex = index
      this.clickCount++
      this.clickCount%2===0?this.isUp=false:this.isDown=true
      this.clickCount%2!==0?this.isUp=true:this.isDown=false
      console.log(index,this.clickCount)
    }
  }
}
</script>

<style scoped>
.active{
  color: #fd0098;
}
.filter-icon-up{
  background-image: url("~assets/image/filterBar/arrow_filter_up.png") !important;
}
.filter-icon-down{
  background-image: url("~assets/image/filterBar/arrow_filter_down.png") !important;
}
.filter-bar-container{
  display: flex;
  width: 100%;
  height: 3rem;
  align-items: center;
  justify-items: center;
  text-align: center;
}
.filter-bar-container .filter-bar-item{
  display: flex;
  flex: 1;
  align-items: center;
  justify-items: center;
}
.filter-bar-item div{
  text-align: right;
}
.filter-bar-item div:first-child{
  margin-left: 50%;
  transform: translateX(-50%);
}
.filter-bar-item div:last-child{
  margin-left: -15%;
}
.item-icon-container i{
  position: relative;
  margin-top: .2rem;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background-image: url("~assets/image/filterBar/arrow_filter_normal.png");
  background-size: cover;
}
.filter-bar-item .item-icon-container{
  text-align: left;
}
</style>