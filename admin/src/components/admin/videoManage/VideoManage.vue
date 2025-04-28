<script setup lang="ts">
import { onMounted, onUnmounted, ref} from 'vue'
import FileUploader from "@/components/common/FileUploader.vue";
import {UploadFilled} from "@element-plus/icons-vue";
import {getVideo} from "@/network/request";
import {ElMessage} from "element-plus";
const isShowUploadComponent = ref<boolean>(false)
const formData = ref<any>({
  url:[],
  title:'',
  files:[]
})
const videoData = ref<any[]>([])
const videoBoxRef = ref<any[]>([])

const openUploadComponent = ()=>{
  isShowUploadComponent.value = !isShowUploadComponent.value;
  //清空formData数据
  formData.value = {
    url:[],
    title:'',
    files:[]
  }
}

const hideElements = (data:any)=>{
  changeTargetStyle(data.targetClass);
  formData.value.url.push(data.url)
  formData.value.files.push(data.file)
}

const changeTargetStyle = (targetClass:any)=>{
  const target:any = document.getElementById(targetClass);
  const previewParent:any = target.parentElement;
  //获取父元素的同级元素,并隐藏
  const siblingEl:any = previewParent?.previousElementSibling;
  if(siblingEl.display !== 'none'){
    siblingEl.style.display = "none";
  }
  //显示预览元素
  if(previewParent.display !== 'block'){
    previewParent.style.display = "block";
  }

  //设置目标元素的宽高
  const TW = previewParent.clientWidth;
  const TH = previewParent.clientHeight;
  target.style.width = TW + 'px';
  target.style.height = TH + 'px';
}

const resizeHandler = ()=>{
  const videoEl:any = document.getElementById('preview-video');
  const imageEl:any = document.getElementById('preview-image');

  if(videoEl && videoEl.parentElement.clientHeight){
    changeTargetStyle('preview-video');
  }
  if(imageEl && imageEl.parentElement.clientHeight){
    changeTargetStyle('preview-image');
  }
}

const uploadSuccess = (data:any)=>{
  //上传成功，关闭上传组件，展示上传后的数据
  openUploadComponent();
  videoData.value.push(data);
  //清空formData数据
  formData.value = {
    url:[],
    title:'',
    files:[]
  }
}

//鼠标移入，视频开始播放
const videoPlay = (index:number)=>{
  changeVideoStatus(true,index)
}
const changeVideoStatus = (status:boolean,index:number)=>{
  const videoEl:any = videoBoxRef.value[index].getElementsByTagName('video')[0];
  status ? videoEl.play() : videoEl.pause();
}
//鼠标移出，视频暂停
const videoPause = (index:number)=>{
  changeVideoStatus(false,index)
}

const onPlay = (e:any)=>{

}

const onTimeUpdate = (e:any)=>{
  setVideoTime(e,'video-current-time','currentTime')
}

const onPause = (e:any)=>{
  e.target.currentTime = 0
}

const onLoadedMetaData = (e:any) =>{
  setVideoTime(e,'video-duration','duration')
}

const setVideoTime = (event:any,target:string,time:string)=>{
  const index = event.target.dataset.videoIndex;
  const durationEl = videoBoxRef.value[index]?.getElementsByClassName(target)?.item(0);
  //获取分钟
  const minutes = Math.floor((event.target[time] % 3600) / 60);
  //获取秒数
  const seconds = Math.ceil(event.target[time] % 60);
  //时间整合并自动补0
  durationEl.innerText = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

onMounted(()=> {
  //获取视频数据
  getVideo().then((result:any)=>{
    if(result.data.code === 500){
      ElMessage({
        type: 'error',
        message: result.data.error
      })
    }
    else {
      videoData.value.push(...result.data.videos);
    }
  })
  window.addEventListener('resize', resizeHandler)
})
onUnmounted(()=>{
  window.removeEventListener('resize',resizeHandler)
})
</script>

<template>
  <div class="video-list-container">
    <!-- 展示视频列表 -->
    <div class="video-display-container">
      <ul class="video-display-ul">
        <li class="video-display-li" v-for="(item,index) in videoData" :key="item.uid">
          <div class="video-display-item">
            <div class="video-thumbnail-video" :ref="(el:any)=> videoBoxRef[index] = el" @mouseenter="videoPlay(index)" @mouseleave="videoPause(index)">
              <img class="video-thumbnail" :src="item.image_url" alt='video_image_preview'>
              <video class="video-display" loop :data-video-index="index" @loadedmetadata="onLoadedMetaData" @timeupdate="onTimeUpdate" @play="onPlay" @pause="onPause" :src="item.video_url" muted></video>
              <div class="video-update-duration">
                <span class="video-current-time">00:00</span>
                <span class="video-duration"></span>
              </div>
            </div>
            <div class="video-info-box">
              <p class="video-title text-ellipsis-multiline">{{item.title}}</p>
              <span class="video-upload-time">{{item.upload_time}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 展示视频列表 -->
    <div v-if="isShowUploadComponent" class="upload-component">
      <!--   文件上传组件   -->
      <el-form class="upload-content">
          <div class="video-image-preview-box">
            <div class="video-preview-box">
              <div class="upload-mini-box">
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <file-uploader option-title="上传视频" @hide-elements="hideElements" :just-preview="true" preview-target="preview-video"></file-uploader>
              </div>
              <div class="preview-box">
                <video controls contenteditable="true" width="100%" height="100%" id="preview-video" src="/"></video>
              </div>
            </div>
            <div class="image-preview-box">
                <div class="upload-mini-box">
                  <el-icon class="upload-icon"><UploadFilled /></el-icon>
                  <file-uploader :accept-file-type="{name:'图片',type:'image'}" @hide-elements="hideElements" preview-target="preview-image" :just-preview="true" option-title="上传图片"></file-uploader>
                </div>
                <div class="preview-box">
                <img id="preview-image" src="/" alt="file_preview_image">
              </div>
            </div>
          </div>
          <el-form-item label="视频标题:" class="file-title">
            <el-input v-model="formData.title" type="textarea" size="small" placeholder="视频标题" label="视频标题"></el-input>
          </el-form-item>
          <file-uploader button-type="success" @upload-success="uploadSuccess" :form-data="formData" :just-upload="true" option-title="上传"></file-uploader>
      </el-form>
    </div>
  </div>
  <div class="upload-button-box">
    <el-button v-show="!isShowUploadComponent" class="show-upload-btn" type="success" @click="openUploadComponent">添加视频</el-button>
    <el-button v-show="isShowUploadComponent" class="show-upload-btn" type="success" @click="openUploadComponent">取消添加</el-button>
  </div>
</template>

<style scoped lang="scss">
@mixin display_flex($justify:center,$align:center,$flexWrap:wrap) {
  display: flex;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $flexWrap;
}

.video-list-container {
  position: relative;
  height: calc(100% - 150px);
  box-sizing: border-box;
}
.upload-component{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.show-upload-btn{
  margin: 10px 0;
}
.upload-content{
  position: relative;
  padding: 1rem;
  left: 50%;
  top: 50%;
  width: 90%;
  height: 90%;
  background-color: #fff;
  border-radius: 1rem;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 1rem #ccc;
  overflow-y: scroll;
}
.video-image-preview-box{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 70%;
}
.video-preview-box{
  width: 60%;
  height: 100%;
}
.image-preview-box{
  width: 30%;
  height: 100%;
}
.video-preview-box,.image-preview-box{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  border-radius: 1rem;
  text-align: center;
}
.upload-icon{
  font-size: 3rem;
}
.preview-box{
  display: none;
  width: 100%;
  height: 100%;
}
#preview-image,#preview-video{
  object-fit: contain;
}
.file-title{
  margin-top: 1rem;
  margin-left: 1rem;
  width: 50%;
}

//视频列表
.video-list-container{
  padding: 0 1rem;
  width: 100%;
  height: calc(100% - 140px);
  overflow-y: scroll;
}
.video-display-ul{
  margin: 0;
  padding: 0;
  @include display_flex(flex-start,flex-start);
  width: 100%;
  height: 100%;
}
.video-display-li{
  margin-bottom: 1rem;
  width: 25%;
  min-width: 200px;
  border-radius: .5rem;
  overflow: hidden;
  cursor: pointer;
}
.video-display-item{
  padding: 1rem;
}
.video-thumbnail{
  width: -webkit-fill-available;
  border-radius: .5rem;
}
.video-info-box{
  position: relative;
  height: 5rem;
  text-align: left;
}
.video-upload-time{
  position: absolute;
  bottom: 0;
  color: #9499A0;
  font-size: 14px;
}
.video-thumbnail-video{
  position: relative;
}
.video-display{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  border-radius: .5rem;
  content-visibility: visible !important;
  transition: opacity 0.3s linear;
  background-color: #fff;
}
.video-thumbnail-video:hover .video-display,
.video-thumbnail-video:hover .video-current-time{
  opacity: 1;
}
.video-update-duration{
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #fff;
  font-size: 13px;
  text-shadow: 0 0 4px #8c8b8b;
  letter-spacing: 1px;
}
.video-current-time{
  opacity: 0;
  transition: opacity .5s ease-in-out;
}
.video-current-time::after{
  display: inline-block;
  content: '/';
  width: 6px;
}
</style>
