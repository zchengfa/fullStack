<script setup lang="ts">

</script>

<template>
  <router-view></router-view>
</template>

<style>
body{
  margin: 0 auto;
  scroll-behavior: smooth;
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
.mall-table{
  height: 70vh !important;

}
/* 隐藏水平滚动条 */
::-webkit-scrollbar {
  width: 0; /* 设置滚动条的宽度为0.5em（根据需求调整）*/
  height: 0;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 设置滚动条的背景色 */
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* 设置滚动条的前景色 */
}
/* 多行文本溢出 */
.text-ellipsis-multiline{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
:root{
  --percent:0;
  --empty-text: #a8a3a3;
}
</style>
