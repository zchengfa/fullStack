<template>
<div class="chat-other-controller">
  <div class="photo" @click="openPhotoAlbum"><img src="~assets/image/customer/photo.png" alt="photo"></div>
</div>
</template>

<script>
export default {
  name: "ChatOther",
  methods:{
    openPhotoAlbum(){
       navigator.mediaDevices.getUserMedia().then(res => {
         console.log(res)
       })
    }
  }

}
</script>

<style scoped>

</style>