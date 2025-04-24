<script setup lang="ts">
import FileUploader from "@/components/common/FileUploader.vue";

</script>

<template>
  <video width="320" height="240" controls>
    <source src="http://192.168.31.22:3000/4dadf44aef61b244d018fb614de65a60.mp4" type="video/mp4">

    您的浏览器不支持 video 标签。
  </video>
<file-uploader option-title="添加视频"></file-uploader>
</template>

<style scoped>

</style>
