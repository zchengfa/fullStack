<template>
  <div class="add-product">
    <el-row class="add-product-row">
      <el-col :span="12">
        <el-form class="add-product-form">
          <el-form-item label="商品描述：">
            <el-input v-model="productBase.description" type="textarea" :autosize="{maxRows:5}" placeholder="请添加商品描述"></el-input>
          </el-form-item>
          <el-form-item label="商品图片链接：">
            <el-input v-model="productBase.imageLink" placeholder="图片链接"></el-input>
          </el-form-item>
          <el-form-item label="商品数量：">
            <el-input v-model="productBase.productCount" type="number" placeholder="数量"></el-input>
          </el-form-item>
          <el-form-item label="商品价格：">
            <el-input v-model="productBase.price" placeholder="价格"></el-input>
          </el-form-item>
          <el-form-item label="尺寸：">
            <el-checkbox-group v-model="checkBox.sizeCheckList">
              <el-checkbox v-for="item in checkBox.sizeOptionList" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-input v-model="productBase.brand" placeholder="品牌"></el-input>
          </el-form-item>
          <el-form-item label="适用季节：">
            <el-checkbox-group v-model="checkBox.seasonCheckList">
              <el-checkbox v-for="item in checkBox.seasonOptionList" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="领型：">
            <el-checkbox-group v-model="checkBox.collarTypeCheckList">
              <el-checkbox v-for="item in checkBox.collarTypeOptionList" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="袖长：">
            <el-select v-model="selectOption.selection">
              <el-option v-for="item in selectOption.option" :value="item" :label="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="$emit('cancelAddClick')">取消</el-button>
            <el-button type="success" @click="$emit('confirmAddClick')">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";

export default defineComponent({
  name: "AddProduct",
  emits:['cancelAddClick','confirmAddClick'],
  setup(){
    let productBase = reactive({
      description:<string>'',
      imageLink:<string>'',
      productCount:<number>0,
      price:<string>'',
      brand:<string>''
    })

    let checkBox = reactive({
      sizeCheckList:<string[]>['M'],
      sizeOptionList:<string[]>['S','M','L','XL','XXL'],
      seasonCheckList:<string[]>['夏季'],
      seasonOptionList:<string[]>['春季','夏季','秋季','冬季'],
      collarTypeCheckList:<string[]>['立领','V领'],
      collarTypeOptionList:<string[]>['圆领','立领','V领','高领','翻领'],
    })

    let selectOption= reactive({
      selection:<string>'三分',
      option:<string[]>['三分','五分','七分','九分','长袖','长裤']
    })

    return {
      productBase,
      checkBox,
      selectOption
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
.add-product-row{
  margin: 1rem auto;
  width: 50%;
  height: 80%;
  background-color: #fff;
}
.add-product-form{
  width: 90%;
  margin: 1rem auto;
}
</style>