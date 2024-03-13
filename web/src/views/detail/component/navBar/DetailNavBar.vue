<template>
  <div class="detail-nav-bar">
    <nav-bar>
      <div @click="goBack" class="back" slot="left"><img src="~assets/image/detail/back.svg" alt="backImage"> </div>
      <div class="nav-center" slot="center">
        <div class="nav-title" v-for="(item, index) in navList"
             :key="index"
             @click="itemClick(index)"
             :class="{active:currentIndex===index}"
        >{{item}}</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import {backPreviousPageMixins} from '@/common/mixins/mixins.js'
  export default {
    name: "DetailNavBar",
    mixins:[backPreviousPageMixins],
    props:{
      navList:{
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
    components:{
      NavBar
    },
    methods:{
      itemClick(index){
        this.currentIndex =index
        this.$emit('scrollThere',index)
      }
    }
  }
</script>

<style scoped>
  .active{
    color: #e02929;
  }
  .detail-nav-bar{
    position: relative;
    width: 100%;
    height: 44px;
    background-color: #ffffff;
    border-bottom: 1px solid #d9d2d2;
    z-index: 10;
  }
  .back{
    height: 100%;
  }
  .back img{
    margin-top: 15%;
    width: 26px;
    height: 26px;
  }
  .nav-center{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .nav-title{
    margin: 0 1rem;
    padding: 4px;
    font-size: .8rem;
  }
</style>
