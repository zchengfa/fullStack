<script setup lang="ts">

</script>

<template>
  <el-row class="padding-box filter-box">
    <el-button type="warning" size="small" class="add-preferential">添加优惠券</el-button>
    <div>
      <div class="category-selector-box">
        <span>优惠券名称：</span>
        <el-input placeholder="请输入优惠券名称"></el-input>
      </div>
      <div class="category-selector-box">
        <span>优惠券类型：</span>
        <el-select placeholder="全部" class="select">
          <el-option label="全部"></el-option>
        </el-select>
      </div>
      <div class="category-selector-box">
        <span>店铺/平台券：</span>
        <el-select placeholder="全部" class="select">
          <el-option label="全部"></el-option>
        </el-select>
      </div>

    </div>
  </el-row>
  <el-row class="padding-box">

  </el-row>
  <el-row>

  </el-row>
</template>

<style scoped>
.padding-box{
  padding: 10px;
  border: 1px solid #d7d4d4;
}
.filter-box{
  display: flex;
  flex-direction: column;
}
.add-preferential{
  width: 100px;
}
</style>