<script setup lang="ts">
import {ref} from "vue";
import {CircleCloseFilled} from "@element-plus/icons-vue";

const props = defineProps({
  type:{
    type:String,
    default(){
      return 'primary'
    }
  },
  title:{
    type:String,
    default(){
      return ''
    }
  },
  menu:{
    type:Array,
    default(){
      return []
    }
  }
})

const color = ref({'default':'#fff','primary':'#409eff','success':'#67c23a','info':'#909399','warning':'#e6a23c','danger':'#f56c6c'})

const emit = defineEmits(['closeSkew'])
function closeSkew(name:string){
  emit('closeSkew',name)
}
</script>

<template>
  <div class="menu-container">
    <div v-if="menu" class="show-skew-box">
      <div class="skew-container" @click.prevent="closeSkew(item.name)"  v-for="(item,index) in menu" :key="index">
        <div class="skew-box" :class="{'border-skew':item.type === 'default'}" :style="{backgroundColor:color[item.type]}"></div>
        <div class="title-icon">
          <span class="skew-title" :class="{'default-color':item.type === 'default'}">{{item.name}}</span>
            <el-icon class="close-tag" :class="{'default-color':item.type === 'default'}"><CircleCloseFilled /></el-icon>
        </div>
        <div class="skew-box" :class="{'border-skew':item.type === 'default'}" :style="{backgroundColor:color[item.type]}"></div>
      </div>
    </div>
    <div v-else  class="show-skew-box">
      <div class="skew-container" @click.prevent="closeSkew(<string>title)">
        <div class="skew-box" :class="{'border-skew':type === 'default'}" :style="{backgroundColor:color[type]}"></div>
        <div class="title-icon">
          <span class="skew-title" :class="{'default-color':type === 'default'}">{{title.length ? title : type}}</span>
          <span class="close-tag" :class="{'default-color':type === 'default'}">x</span>
        </div>
        <div class="skew-box" :class="{'border-skew':type === 'default'}" :style="{backgroundColor:color[type]}"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-container{
  margin: 10px 0;

  border: 1px solid #e9dede;
}
.show-skew-box{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  cursor:pointer;
}
.skew-container{
  position: relative;
  padding: 10px;
  max-width: 160px;
  max-height: 53px;
  width: 100px;
  height: 30px;
  min-width: 70px;
  min-height: 23px;
}
.skew-box{
  width: 100%;
  height: 50%;
}
.title-icon{
  position: absolute;
  top:50%;
  left: 50%;
  display: flex;
    align-items: center;
    justify-content: center;
  transform: translate(-50% , -50%);
  white-space: nowrap;
  z-index: 1;
}
.skew-title{
  margin-right: 4px;
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
}
.close-tag{
  color: #fff;
  font-size: 12px;
}
.default-color{
  color: #000;
}
.skew-box:first-child{
  transform: skew(45deg);
}
.skew-box:last-child{
  transform: skew(-45deg);
}
.border-skew{
  border: 1px solid #909399;
}
.border-skew:first-child{
  border-bottom: 0 none transparent ;

}
.border-skew:last-child{
  border-top: 0 none transparent;
}
</style>