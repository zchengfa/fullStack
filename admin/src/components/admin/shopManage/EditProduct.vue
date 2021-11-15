<template>
  <div class="edit-product">
    <el-row>
      <el-col :span="12">
        <el-form ref="ruleForm" v-for="item in formLogic.data">
          <el-form-item label="商品ID：">
            <span>{{item.id}}</span>
          </el-form-item>
          <el-form-item label="商品描述：">
            <el-input v-model="item.title"></el-input>
          </el-form-item>
          <el-button size="small" type="primary" @click="saveEditClick">保存</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, watchEffect} from "vue";

export default defineComponent({
  name: "EditProduct",
  props:["currentProductData"],
  emits:['saveEdit'],
  setup(props,{emit}){

    let formLogic = reactive({
      data:[...props.currentProductData]
    })

    function saveEditClick(){
      emit('saveEdit',formLogic.data)
    }
    return {
      formLogic,
      saveEditClick
    }
  }
})
</script>

<style scoped>
.edit-product{
  position: absolute;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(211,211,220,.5);
  z-index: 9;
  color: red;
}
</style>