<script setup lang="ts">
import {userStore} from "../../pinia/pinia";
import {ElIcon} from "element-plus";
import {Loading} from "@element-plus/icons-vue";
const store = userStore()
const showLoading = ()=>{
  store.changeLoadingStatus(true)
}

const hiddeLoading = ()=>{
  store.changeLoadingStatus(false)
}

defineExpose({
  showLoading,hiddeLoading
})
</script>

<template>
  <div class="loading-container" v-show="store.isLoading">
    <el-icon class="is-loading"><Loading class="loading-icon"></Loading></el-icon>
    <span class="loading-text">数据加载中...</span>
  </div>
</template>

<style scoped lang="scss">
$width:2rem;
$height:2rem;
@mixin iconSize {
  width:$width;
  height:$height;
}
.loading-container{
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  color: #fff;
  background-color: rgba(0,0,0,.3);
  .loading-text{
    padding-top: .5rem;
    font-size: 12px;
  }
  .is-loading{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $width;
    @include iconSize
  }
}

</style>