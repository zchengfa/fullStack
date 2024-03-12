<template>
  <div class="menu-box">
    <div v-for="(menu,menuIndex) in $props.MenuData" :key="menuIndex" @click="toMenuDetail(menu['location'],menu['title'])">
      <div class="image-box"><img :src="menu['icon']" alt="menu_icon"></div>
      <span>{{menu['title']}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorMenu",
  props:{
    MenuData:{
      type:Array,
      default(){
        return []
      }
    }
  },
  methods:{
    toMenuDetail(location,title){
      if (location){
        this.$router.push(location)
      }
      else{
        this.$toast.showToast(`${title}详情页还未完善，敬请期待！`)
      }
    }
  }
}
</script>

<style scoped>
.menu-box{
  margin: 1rem auto;
  padding: .5rem;
  display: flex;
  justify-items: center;
  align-items: center;
  width: 94%;
  flex-wrap: wrap;
  border-radius: .5rem;
  background-image: linear-gradient(to right top,  #8da8ff, #ff83b9, #ff9096, #ffad70, #ffd455, #e7fb5f);
}
.menu-box div{
  margin: .2rem 0;
  width: 20%;
}
.menu-box div .image-box{
  width: 100%;
  text-align: center;
}
.menu-box div span{
  display: inline-block;
  width: 100%;
  font-size: .9rem;
  color: #fff;
  text-align: center;
}
.menu-box div img{
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  transform: scale(.8);
}
</style>