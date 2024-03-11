<template>
<div class="personal-avatar">
  <nav-bar>
    <div slot="left" @click="goBack" class="back">
      <img class="personal-img" src="~assets/image/detail/back.svg" alt="back">
    </div>
    <div slot="center">个人头像修改</div>
  </nav-bar>
  <div class="content">
    <img class="avatar-big" :src="$route.params.avatar" alt="avatar">
  </div>
  <input type="file"  class="file" >
</div>

</template>

<script>
import {backPreviousPageMixins} from '@/common/mixins/mixins'
import NavBar from "@/components/common/navbar/NavBar.vue";
export default {
  name: "Avatar",
  mixins:[backPreviousPageMixins],
  components:{
    NavBar
  }
}
</script>

<style scoped>
.personal-avatar{
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color:#fff;
  text-align: center;
  z-index: 14;
}
.personal-avatar>.content{
  display: flex;
  justify-content: center;
  position: relative;
  top:25%;
  width: 100%;
  height: 50%;
  transform: translateY(-25%);
  background-color: #fff;
}

.personal-img{
  position: relative;
  margin-top: 25%;
  transform: translateY(-25%);
}
.avatar-big{
  height: 100%;
}
.file{
  position: relative;
  top:15%;
  margin-top: 1rem;
  text-align: center;
  transform: translateY(-25%);
}
</style>