<template>
<div class="filter-bar-container">
 <div class="filter-bar-item" v-for="(item,index) in list" :key="item+index" @click="filterData(index)">
   <div :class="{'active':currentIndex===index}">{{item}}</div>
   <div class="item-icon-container">
     <i class="filter-icon" :class="{'filter-icon-up':isUp&&(currentIndex===index)&&(index===0||index===1),'filter-icon-down':isDown&&(currentIndex===index)&&(index===0||index===1)}" v-show="index ===0 || index === 1"></i>
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
      clickPriceCount:0,
      clickDiscountCount:0,
      clickSalesCount:0,
      clickFilterCount:0,
      currentIndex:-1
    }
  },
  methods:{
    filterData(index){
      this.currentIndex = index

      if (index === 0){
        this.clickPriceCount++
        this.clickDiscountCount=0
        this.clickSalesCount=0
        this.clickFilterCount=0

        this.clickPriceCount===1?this.isDown=true:this.isDown=false
        this.clickPriceCount===2?this.isUp=true:this.isUp=false

        if (this.isUp){
          this.$emit('sort',{'up':this.isUp,'way':'price'})
        }
        if (this.isDown){
          this.$emit('sort',{'down':this.isDown,'way':'price'})
        }
        if (this.clickPriceCount===3){
          this.isUp = false
          this.isDown = false
          this.currentIndex = -1
          this.clickPriceCount = 0
          this.$emit('sort',{'way':'normal'})
        }
      }
      else if(index === 1){
        this.clickPriceCount=0
        this.clickDiscountCount++
        this.clickSalesCount=0
        this.clickFilterCount=0
        this.clickDiscountCount===1?this.isDown=true:this.isDown=false
        this.clickDiscountCount===2?this.isUp=true:this.isUp=false
        if (this.isUp){
          this.$emit('sort',{'up':this.isUp,'way':'discount'})
        }
        if (this.isDown){
          this.$emit('sort',{'down':this.isDown,'way':'discount'})
        }
        if (this.clickDiscountCount===3){
          this.isUp = false
          this.isDown = false
          this.currentIndex = -1
          this.clickDiscountCount = 0
          this.$emit('sort',{'way':'normal'})
        }
      }
      else if (index===2){
        this.clickPriceCount=0
        this.clickDiscountCount=0
        this.clickSalesCount++
        this.clickFilterCount=0
        this.clickSalesCount===1?this.currentIndex=index:null
        this.clickSalesCount===2?this.currentIndex=-1:null
        this.clickSalesCount===2?this.clickSalesCount=0:null
        if (this.clickSalesCount===1){
          this.$emit('sort',{'up':true,'way':'sales'})
        }
        if (this.clickSalesCount===0){
          this.$emit('sort',{'down':true,'way':'sales'})
        }
      }
      else {
        this.clickPriceCount=0
        this.clickDiscountCount=0
        this.clickSalesCount=0
        this.clickFilterCount++
        this.clickFilterCount===1?this.currentIndex=index:null
        this.clickFilterCount===2?this.currentIndex=-1:null
        this.clickFilterCount===2?this.clickFilterCount=0:null
      }
    }
  }
}
</script>

<style scoped>
.active{
  color: #fd0098;
}
.item-icon-container .filter-icon-up{
  background-image: url("~assets/image/filterBar/arrow_filter_up.png");
}
.item-icon-container .filter-icon-down{
  background-image: url("~assets/image/filterBar/arrow_filter_down.png");
}
.filter-bar-container{
  display: flex;
  width: 100%;
  height: 3rem;
  align-items: center;
  justify-items: center;
  text-align: center;
  border-top: 1px solid #e1dbdb;
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
  width: 12px;
  height: 12px;
  background-image: url("~assets/image/filterBar/arrow_filter_normal.png");
  background-size: cover;
}
.filter-bar-item .item-icon-container{
  text-align: left;
}
</style>