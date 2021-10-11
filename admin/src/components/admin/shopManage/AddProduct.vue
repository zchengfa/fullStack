<template>
  <div class="add-product">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="cancelAdd">取消</el-button>
        <el-button type="success" @click="confirmAdd">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AddProduct",
  emits:[],
  setup(){

    function cancelAdd(){

    }

    function confirmAdd(){

    }

    return {
      cancelAdd,
      confirmAdd
    }
  }
})
</script>

<style scoped>
.add-product{
  position: absolute;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(211,211,220,.5);
  z-index: 10;
}
</style>