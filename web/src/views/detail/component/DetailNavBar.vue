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
  export default {
    name: "DetailNavBar",
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
      goBack(){
        //点击返回图标返回之前的页面
        this.$router.back()
      },
      itemClick(index){
        this.currentIndex =index
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
    background-color: #ffffff;
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
  }
  .nav-title{
    flex:1;
    font-size: 14px;
  }
</style>
