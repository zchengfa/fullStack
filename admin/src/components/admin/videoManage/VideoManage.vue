<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, onUnmounted, ref} from 'vue'
import FileUploader from "@/components/common/FileUploader.vue";
import {Close, UploadFilled,Loading} from "@element-plus/icons-vue";
import {deleteFile, getVideo} from "@/network/request";
import {ElMessage, ElMessageBox} from "element-plus";
const isShowUploadComponent = ref<boolean>(false)
const formData = ref<any>({url:[], title:'', files:[]})
const videoData = ref<any[]>([])
const videoBoxRef = ref<any[]>([])
const videoCurrentTime = ref<any>(0)
const isShowSwingCloseBtn = ref<boolean>(false)

const editVideo = ()=>{
  isShowSwingCloseBtn.value = !isShowSwingCloseBtn.value
}

const deleteVideo = (e:any,item:any)=>{
  //阻止事件冒泡
  e.stopPropagation();
  ElMessageBox.confirm(
      '您是否真的要删除当前视频',
      'Warning',
      {
        confirmButtonText:'删除',
        cancelButtonText:'取消',
        type: 'warning',
        center:true
      }
  ).then(async ()=>{
    const result = await deleteFile({
      uid:item.uid,
      file_video_name:item.video_url.slice(item.video_url.lastIndexOf('/')+1),
      file_image_name:item.image_url.slice(item.image_url.lastIndexOf('/')+1)
    });
    if(result.data.code === 200){
      ElMessage({
        type: 'success',
        message: result.data.message
      })
      videoData.value.map((it:any,index:number)=>{
        if(it.uid === item.uid){
          videoData.value.splice(index,1)
          videoBoxRef.value.splice(index,1)
          //删除后判断视频列表是否为空
          nextTick(()=>{
            if(videoData.value.length === 0){
              videoBoxRef.value = []
            }
          })
        }
      })
    }
    else if(result.data.code === 500){
      ElMessage({
        type: 'error',
        message: result.data.error
      })
    }
    //关闭删除按钮
    editVideo();
  }).catch(()=>{
    ElMessage({
      type:'error',
      message:`您已取消了视频的删除操作`
    })
  })
}

const openUploadComponent = ()=>{
  isShowUploadComponent.value = !isShowUploadComponent.value;
  //清空formData数据
  formData.value = {url:[], title:'', files:[]};
}

const hideElements = (data:any)=>{
  changeTargetStyle(data.targetClass);
  formData.value.url.push(data.url);
  formData.value.files.push(data.file);
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
  formData.value = {url:[], title:'', files:[]};
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

const onTimeUpdate = (e:any)=>{
  setVideoTime(e,'video-current-time','currentTime')
  videoCurrentTime.value = e.target.currentTime;
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
  if(durationEl){
    durationEl.innerText = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }
}

//使用IntersectionObserver监听元素视口，控制元素显示隐藏，提高性能
let observer:any = new IntersectionObserver((entries)=> {
  entries.forEach((entry:any) => {
    if(entry.isIntersecting){
      //显示元素
      entry.target.className = 'video-display-li video-display-li-show'
    }
    else{
      //隐藏元素
      entry.target.className = 'video-display-li video-display-li-hidden'
    }
  })
},{rootMargin:'0px 0px 50px 0px'});

const changeBigVideoStatus = (isShow:boolean,url:string)=>{
  const bigScreenVideoEl:any = document.querySelector(isShow ? '.video-big-screen' : '.video-big-screen-show');
  bigScreenVideoEl.className = isShow ? 'video-big-screen-show' : 'video-big-screen';

  const setVideoUrl = ()=>{
    const videoEl = bigScreenVideoEl.querySelector('#big-screen-video');
    videoEl.setAttribute('src',url);
    videoEl.currentTime = videoCurrentTime.value;
  }
  if(isShow){
    setVideoUrl();
  }
  else{
    //关闭时，先移走，再改变视频播放地址
    let timer = setTimeout(()=>{
      setVideoUrl();
      clearTimeout(timer);
    },500)
  }

}

const watchVideo = (e:any,url:string)=>{
  e.stopPropagation();
  changeBigVideoStatus(true,url)
}

const closeBigVideo = ()=>{
  changeBigVideoStatus(false,'/')
}

onMounted(async ()=> {
  //获取视频数据
  const result = await getVideo()
  if (result.data.code === 500) {
    ElMessage({
      type: 'error',
      message: result.data.error
    })
  } else {
    videoData.value.push(...result.data.videos);
  }

  await nextTick(()=>{
    //监听元素视口
    const observerEls:any = document.getElementsByClassName('video-display-li');
    if(observerEls.length){
      Array.from(observerEls).forEach((el:any)=>{
        observer.observe(el);
      })
    }
  })
  window.addEventListener('resize', resizeHandler)
})

//监听盒子滚动
const scrollVideoRef = ref<any>(null)
const loading = ref<boolean>(false);
const oldScrollTop = ref<number>(0);
const loadMoreVideo = ()=>{
  loading.value = true
  getVideo(videoData.value.length,false).then((result:any)=>{
    if(result.data.code === 200){
      videoData.value.push(...result.data.videos);
      let timer = setTimeout(()=>{
        loading.value = false;
        if (!result.data.videos.length){
          ElMessage({
            type: 'warning',
            message: '没有更多视频了喔！'
          })
        }
        clearTimeout(timer);
      },500)
    }
  })
}
const onScrollVideoContainer = ()=>{
  const {scrollTop,clientHeight,scrollHeight} = scrollVideoRef.value;
  const direction = scrollTop > oldScrollTop.value ? 'up' : 'down';
  if(!loading.value && clientHeight + scrollTop >= scrollHeight - 10 && direction === 'up'){
    loadMoreVideo()
  }
  oldScrollTop.value = scrollTop
}


onBeforeUnmount(()=>{
  //组件卸载前，移除视频监听事件
  if(videoData.value.length){
    videoBoxRef.value.forEach((item:any)=>{
      const video = item.getElementsByTagName('video')[0];
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetaData);
    })
  }
})
onUnmounted(()=>{
  window.removeEventListener('resize',resizeHandler);
  observer.disconnect();
})
</script>

<template>
  <div class="video-list-container">
    <!-- 展示视频列表 -->
    <div class="video-display-container">
      <ul class="video-display-ul" v-if="videoData.length"  ref="scrollVideoRef" @scroll="onScrollVideoContainer">
        <li class="video-display-li" v-for="(item,index) in videoData" :key="item.uid">
          <div class="video-display-item">
            <div class="video-thumbnail-video" @click="(event:any)=> watchVideo(event,item.video_url)" :ref="(el:any)=> videoBoxRef[index] = el" @mouseenter="videoPlay(index)" @mouseleave="videoPause(index)">
              <img class="video-thumbnail" :src="item.image_url" alt='video_image_preview'>
              <video class="video-display" loop :data-video-index="index" @loadedmetadata.once="onLoadedMetaData" @timeupdate="onTimeUpdate" @pause="onPause" :src="item.video_url" muted></video>
              <div class="video-update-duration">
                <span class="video-current-time">00:00</span>
                <span class="video-duration"></span>
              </div>
              <el-button v-show="isShowSwingCloseBtn" @click="(event:any)=> deleteVideo(event,item)" class="single-video-close" circle size="small"><el-icon><Close></Close></el-icon></el-button>
            </div>
            <div class="video-info-box">
              <p class="video-title text-ellipsis-multiline">{{item.title}}</p>
              <span class="video-upload-time">{{item.upload_time}}</span>
            </div>
          </div>
        </li>
      </ul>
      <span v-else class="empty-video-text">当前还没有任何视频</span>
      <div v-if="loading" class="loading-video-box">
        <el-icon><Loading></Loading></el-icon>
        <p class="loading-text">加载更多视频中...</p>
      </div>
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
    <el-button v-if="isShowSwingCloseBtn" type="danger" @click="editVideo">再想一想</el-button>
    <el-button v-else-if="!isShowSwingCloseBtn && videoData.length" type="danger" @click="editVideo" v-permission="{permission:'delete',effect:'disabled'}">删除视频</el-button>
    <el-button v-if="!isShowUploadComponent" v-permission="{permission:'add',effect:'disabled'}" class="show-upload-btn" type="success" @click="openUploadComponent">添加视频</el-button>
    <el-button v-else class="show-upload-btn" type="success" @click="openUploadComponent">取消添加</el-button>
  </div>
<!--  视频大屏播放-->
  <div class="video-big-screen">
    <el-button class="close-big-video-btn" @click="closeBigVideo" circle><el-icon><Close></Close></el-icon></el-button>
    <video controls autoplay  src="/" id="big-screen-video"></video>
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
  margin: 10px;
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
}
.video-display-container{
  position: relative;
  width: 100%;
  height: 100%;
}
.video-display-ul{
  margin: 0;
  padding: 0;
  @include display_flex(flex-start,flex-start);
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.video-display-li{
  margin-bottom: 1rem;
  width: 25%;
  min-width: 200px;
  border-radius: .5rem;
  overflow: hidden;
  cursor: pointer;
  transition: opacity .7s ease-in;
}
.video-display-li-show{
  opacity: 1;
  visibility: visible;
}
.video-display-li-hidden{
  opacity: 0;
  visibility: hidden;
}
.video-display-item{
  padding: 1rem;
}
.single-video-close{
  position: absolute;
  right: -10px;
  top: -10px;
  width: 2rem;
  height: 2rem;
  background-color: rgba(0,0,0,.5);
  color: #fff;
  animation: swing 0.6s infinite;
}
@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(15deg); }  /* 右摆 */
  40% { transform: rotate(-10deg); } /* 左摆 */
  60% { transform: rotate(5deg); }   /* 右摆幅度减小 */
  80% { transform: rotate(-5deg); } /* 左摆幅度减小 */
}
.video-thumbnail{
  width: -webkit-fill-available;
  border-radius: .5rem;
  opacity: 1;
  transition: opacity .5s linear;
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
.video-thumbnail-video:hover .video-thumbnail{
  opacity: 0;
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
.empty-video-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--empty-text);
}
//大屏视频
.video-big-screen{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0,0,0,.5);
  transition: left .5s ease-in-out;
}
.video-big-screen-show{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0,0,0,.5);
  transition: left .5s ease-in-out;
}
.video-big-screen-hidden{
  display: none;
  opacity: 0;
}
#big-screen-video{
  width: 80%;
  height: 80%;
  background-color: #fff;
}
.close-big-video-btn{
  position: absolute;
  right: 10%;
  top: 10%;
  transform: translate(50% , -50%);
}
.loading-video-box{
  padding: .5rem;
  background-color: #fff;
  color: #b1aaaa;
}
.loading-video-box .el-icon{
  font-size: 1.2rem;
  animation: spin 2s linear infinite;
}
.loading-text{
  margin: 0;
  font-size: .8rem;
  transform-origin: center center;
  transform: scale(.8);
}
@keyframes spin {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
