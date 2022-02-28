<template>
<div class="chat-other-controller">
  <div class="photo" @click="openPhotoAlbum">
    <img src="~assets/image/customer/photo.png" alt="photo">
    <p>相册</p>
  </div>
  <div class="take_photo" @click="openPhotoAlbum">
    <img src="~assets/image/customer/take_photo.png" alt="take_photo">
    <p>拍摄</p>
  </div>
  <div class="video" @click="openPhotoAlbum">
    <img src="~assets/image/customer/video.png" alt="video">
    <p>视频通话</p>
  </div>
  <div class="location" @click="openPhotoAlbum">
    <img src="~assets/image/customer/location.png" alt="location">
    <p>位置</p>
  </div>
  <div class="red_paper" @click="openPhotoAlbum">
    <img src="~assets/image/customer/red_paper.png" alt="red_paper">
    <p>红包</p>
  </div>
  <div class="file" @click="openPhotoAlbum">
    <img src="~assets/image/customer/file.png" alt="file">
    <p>文件</p>
  </div>
</div>
</template>

<script>
export default {
  name: "ChatOther",
  methods:{
    openPhotoAlbum(){
      this.$toast.showToast('当前项目处于http域中，无法获取系统设备信息，请等待后期修改')
       // navigator.mediaDevices.getUserMedia().then(res => {
       //   console.log(res)
       // }).catch(err=>{
       //   console.log(err)
       // })

    }
  }

}
</script>

<style scoped>
.chat-other-controller{
  display: flex;
  align-items: center;
  justify-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 94%;
}
.chat-other-controller div{
  margin-top: 1rem;
  width: 25%;
}
img{
  margin-left: 50%;
  width: 2rem;
  height: 2rem;
  transform: translateX(-50%);
}
p{
  text-align: center;
  color: #8a8686;
  font-size: .8rem;
}
</style>