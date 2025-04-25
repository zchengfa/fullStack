<script setup lang="ts">
import {ref} from 'vue'
import sparkMd5 from 'spark-md5'
import {uploadFile,mergeFile} from "@/network/request";
import {ElMessage} from "element-plus";

const uploadProgress = ref<number>(0)

const props = defineProps({
  showFileList:{
    type:Boolean,
    default(){
      return false
    }
  },
  isFileSlice:{
    type:Boolean,
    default(){
      return true
    }
  },
  chunkSize:{
    type:Number,
    default(){
      return 5*1024*1024
    }
  },
  maxConcurrent:{
    type:Number,
    default(){
      return 3
    }
  },
  optionTitle:{
    type:String,
    default(){
      return '上传文件'
    }
  },
  acceptFileType:{
    type:Object,
    default(){
      return {
        name:'视频',
        type:'video'
      }
    }
  }
});

//计算哈希
const calculateFileHash = async (file:any)=>{
  return new Promise((resolve,reject)=>{
    const spark = new sparkMd5.ArrayBuffer()
    const reader = new FileReader()
    reader.onloadend = (e:any)=>{
      spark.append(e.target.result)
      resolve(spark.end());
    }

    reader.onerror = (e:any)=>{
      reject(e)
    }

    reader.readAsArrayBuffer(file)
  })
}

//文件上传
const customUpload =async ({file}:any)=>{
  //判断文件类型，如果不是指定的类型则不执行上传，并且给予用户提示
  if(file.type.indexOf(props.acceptFileType.type) === -1){
    ElMessage({
      type: 'error',
      message:`仅只支持上传${props.acceptFileType.name}类型的文件！`
    })
    return ;
  }
  //得到文件hash值
  const fileHash = await calculateFileHash(file)

  //检查文件hash，看是否已经上传过该文件


  //计算总分片数量
  const totalChunks = Math.ceil(file.size / props.chunkSize)

  //并发控制上传
  let uploadChunks = 0
  const uploadQueue = [] as any[]

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * props.chunkSize , (i+1) * props.chunkSize)
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('hash', fileHash as any)
    formData.append('index', i as any)

    //将上传任务push到上传队列中
    uploadQueue.push((callback:Function)=> uploadFile(formData,callback))
  }

  //分批执行上传任务
  while(uploadQueue.length){
    const results = await Promise.all(uploadQueue.splice(0,props.maxConcurrent).map((task)=> task()))
    results.forEach((item)=>{
      if(item.data.code === 200){
        uploadChunks ++
        uploadProgress.value = (uploadChunks/totalChunks)*100
      }
    })
  }

  if(uploadChunks === totalChunks){
    //通知服务器，所有文件上传完了，可以进行合并了
    await mergeFile({
      hash:fileHash,
      totalChunks:totalChunks,
      file_info:{
        uid:file.uid,
        name: file.name,
        lastModified:file.lastModified,
        type: file.type,
      }
    })
  }

}

</script>

<template>

<!-- 文件上传 -->
  <div class="file-upload-box">
    <el-upload action="/" :http-request="customUpload" name="chunk" :show-file-list="showFileList">
      <el-button type="primary">{{optionTitle}}</el-button>
    </el-upload>
    <el-progress :percentage="uploadProgress" :stroke-width="10" text-inside>
      <template #default="{percentage}">
        <span class="upload-progress">{{percentage}}%</span>
      </template>
    </el-progress>
  </div>
  <!-- 文件上传 -->
</template>

<style scoped>

</style>
