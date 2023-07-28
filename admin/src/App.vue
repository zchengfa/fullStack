<script setup lang="ts">
// import { addDynamicRoutes } from "./router";
// import { userStore } from "./pinia/pinia";
//
// let { token ,addRoutes} = userStore()
//
// if(token !== null){
//
//   //addRoutes(addDynamicRoutes)
// }
</script>

<template>
  <router-view></router-view>
</template>

<style>
body{
  margin: 0 auto;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  width: 100vw;
}
</style>
