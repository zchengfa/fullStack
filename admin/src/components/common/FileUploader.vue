<script setup lang="ts">
import {ref} from 'vue'
import sparkMd5 from 'spark-md5'
import {uploadFile,mergeFile} from "@/network/request";

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
  //得到文件hash值
  const fileHash = await calculateFileHash(file)

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
    uploadQueue.push(()=> uploadFile(formData))
  }

  //分批执行上传任务
  while (uploadQueue.length > 0){
    await Promise.all(uploadQueue.splice(0,props.maxConcurrent).map((task)=> task()))

    uploadChunks += props.maxConcurrent
  }

  //通知服务器，所有文件上传完了，可以进行合并了
  await mergeFile({hash:fileHash,totalChunks:totalChunks})

}

</script>

<template>
  <el-upload action="/" :http-request="customUpload" name="chunk" :show-file-list="showFileList">
    <el-button type="primary">{{optionTitle}}</el-button>
  </el-upload>
</template>

<style scoped>

</style>
