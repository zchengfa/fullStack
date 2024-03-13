<script setup lang="ts">
import { createFormRule } from "../../../common/utils";
import { reactive,ref } from "vue";
import {ElMessage} from "element-plus";

let emit = defineEmits(['cancelCom','confirmAddPreferential'])
function cancelCom (){
    emit("cancelCom")
}

let preferentialRules = reactive({
    rules:createFormRule(
        [
            {
                name:'name',
                message:'优惠券名称不能为空'
            },
            {
                name:'type',
                message:'优惠券类型不能为空'
            },
            'threshold','expired','count'
        ]
    ),
    preferentialFormData:{
        name:<string>'',
        type:<string>'',
        threshold:<number>0,
        expired:<Date> new Date(),
        count:<number>0
    }
})

let preferentialForm = ref(null)
let addPreferential = (formData:{name:string, type:string, threshold:number, expired:Date, count:number})=>{

    (<any>preferentialForm).value.validate((valid:any) => {
        if(valid){
            let { count,threshold } = preferentialRules.preferentialFormData
            count <= 0 ? ElMessage({message:'优惠券库存量需大于0',type:'error'}) : null ;

            threshold <= 0 ? ElMessage({message:'消费门槛需大于0',type:'error'}) : null ;

            (count > 0 && threshold > 0 ) ? emit('confirmAddPreferential',formData) : null ;
        }
    })
}

</script>

<template>
<el-row class="com-bg">
   <el-form class="preferential-form" ref="preferentialForm" :model="preferentialRules.preferentialFormData" :rules="preferentialRules.rules">
       <el-form-item label="优惠券名称：" prop="name">
           <el-input v-model="preferentialRules.preferentialFormData.name" placeholder="请输入优惠券名称"></el-input>
       </el-form-item>
       <el-form-item label="优惠类型：" prop="type">
           <el-input v-model="preferentialRules.preferentialFormData.type" placeholder="请输入优惠类型"></el-input>
       </el-form-item>
       <el-form-item label="消费门槛：" prop="threshold">
           <el-input-number  v-model.number="preferentialRules.preferentialFormData.threshold" size="small" placeholder="消费门槛"></el-input-number>
       </el-form-item>
       <el-form-item label="使用期限：" prop="expired">
           <el-date-picker v-model="preferentialRules.preferentialFormData.expired" type="date" size="small" placeholder="选择期限"></el-date-picker>
       </el-form-item>
       <el-form-item label="优惠券数量：" prop="count">
           <el-input v-model.number="preferentialRules.preferentialFormData.count" size="small" type="number" placeholder="发行数量"></el-input>
       </el-form-item>
       <el-form-item class="btn-form-box">
           <el-button type="primary" size="small" @click="addPreferential(preferentialRules.preferentialFormData)">添加优惠券</el-button>
           <el-button size="small" @click="cancelCom" >取消</el-button>
       </el-form-item>
   </el-form>
</el-row>
</template>

<style scoped>
.com-bg{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
}
.preferential-form{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0 auto;
    width: 40%;
    height: 100%;
    padding: 40px;
    background-color: #fff;
}
.btn-form-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>