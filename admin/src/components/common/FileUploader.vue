<script setup lang="ts">
import {ref} from 'vue'
import sparkMd5 from 'spark-md5'
import {uploadFile,mergeFile,checkFileComplete} from "@/network/request";
import {ElMessage} from "element-plus";

const uploadProgress = ref<number>(0)
const hashArray = ref<any[]>([])
const uploadedFileNum = ref<number>(0)

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
  },
  justPreview:{
    type:Boolean,
    default(){
      return false
    }
  },
  previewTarget:{
    type:String,
    default(){
      return ''
    }
  },
  showProgress:{
    type:Boolean,
    default(){
      return false
    }
  },
  buttonType:{
    type:String,
    default(){
      return 'primary'
    }
  },
  justUpload:{
    type:Boolean,
    default(){
      return false
    }
  },
  formData:{
    type:Object,
    default(){
      return {}
    }
  }
});
const emits = defineEmits(['hideElements','uploadSuccess'])

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

const validateForm = ({url,title,files}:any)=> {

  return url.length ===2 && title.length && files.length === 2
}

const queuePush = (uploadQueue:any[],file:any,i:number,fileHash:string)=>{
  const chunk = file.slice(i * props.chunkSize , (i+1) * props.chunkSize)
  const formData = new FormData()
  formData.append('chunk', chunk)
  formData.append('hash', fileHash as any)
  formData.append('index', i as any)

  //将上传任务push到上传队列中
  uploadQueue.push((callback:Function)=> uploadFile(formData,callback))
}

//文件上传
const customUpload =async ({file}:any)=>{
  if(!props.justUpload){
    //判断文件类型，如果不是指定的类型则不执行上传，并且给予用户提示
    if(file.type.indexOf(props.acceptFileType.type) === -1){
      ElMessage({
        type: 'error',
        message:`仅只支持上传${props.acceptFileType.name}类型的文件！`
      })
      return ;
    }
    //检查此次上传是否只是预览，预览则不上传到服务器
    if(props.justPreview){
      //生成预览地址
      const file_preview_url = URL.createObjectURL(file);
      //获取预览元素,并将预览地址赋值给目标元素
      document.getElementById(props.previewTarget)?.setAttribute('src', file_preview_url)
      //给父组件发送事件，让父组件隐藏其它不必要元素，只显示预览元素
      emits('hideElements',{targetClass:props.previewTarget,url:file_preview_url,file})

      return ;
    }

  }
  //上传
  if(props.justUpload){
      //检测文件及标题是否填写
      if(validateForm(props.formData)){
        hashArray.value = []
        props.formData.files.map(async (file:any)=>{
          //得到文件hash值
          const fileHash:any = await calculateFileHash(file)
          const file_ext = '.' + file.type.slice(file.type.lastIndexOf('/') + 1, file.type.length)
          const file_type = file.type.split('/')[0]

          hashArray.value.push({
            type: file_type,
            file: fileHash + file_ext,
            uid:file.uid,
            lastModified: file.lastModified,
            name: file.name,
          })

          //计算总分片数量
          const totalChunks = Math.ceil(file.size / props.chunkSize)

          //并发控制上传
          let uploadChunks = 0
          const uploadQueue = [] as any[]

          for (let i = 0; i < totalChunks; i++) {
            queuePush(uploadQueue,file,i,fileHash);
          }

          //分批执行上传任务
          while(uploadQueue.length){
            const results = await Promise.all(uploadQueue.splice(0,props.maxConcurrent).map((task)=> task()))
            results.forEach((item)=>{
              if(item.data.code === 200){
                uploadChunks ++
                uploadProgress.value = (uploadChunks/totalChunks)*100
              }
              else if(item.data.code === 500){
                //分片接收失败，提示用户
                ElMessage({
                  type: 'error',
                  message: `${item.data.file.hash}文件的第${item.data.file.index}个分片需要重新上传`
                })

                //需再次上传服务器接收失败的对应分片
                queuePush(uploadQueue,file,item.data.file.index,fileHash);
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
              },
            })

            uploadedFileNum.value ++

            //检查所有文件是否上传完成
            if(props.formData.files.length === uploadedFileNum.value){
              const result = await checkFileComplete({hashArray:[...hashArray.value],file_title:props.formData.title})
              if(result.data.code === 200){
                //给父组件发送事件，让父组件关闭上传组件，并将数据进行展示
                emits('uploadSuccess',result.data.file)
              }
              if(result.data.code === 500){
                ElMessage({
                  type: 'error',
                  message: result.data.error
                })
              }
            }
          }
        })

      }
      else{
        ElMessage({
          message:'请将表单内容填写完整',
          type:'error',
        })
      }
    }
  }
</script>

<template>

<!-- 文件上传 -->
  <div class="file-upload-box">
    <el-button v-if="justUpload" @click="customUpload" :type="buttonType">{{optionTitle}}</el-button>
    <el-upload v-else action="/" :http-request="customUpload" name="chunk" :show-file-list="showFileList">
      <el-button :type="buttonType">{{optionTitle}}</el-button>
    </el-upload>
    <el-progress v-if="props.showProgress" :percentage="uploadProgress" :stroke-width="10" text-inside>
      <template #default="{percentage}">
        <span class="upload-progress">{{percentage}}%</span>
      </template>
    </el-progress>
  </div>
  <!-- 文件上传 -->
</template>

<style scoped>

</style>
