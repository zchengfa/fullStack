<template>
  <div class="add-product">
    <el-row class="add-product-row">
      <el-col :span="12">
        <el-form class="add-product-form" ref="ruleForm" :model="rulesLogic.ruleForm" :rules="rulesLogic.addProductRules">
          <el-form-item label="商品描述：" prop="description">
            <el-input v-model="rulesLogic.ruleForm.description" type="textarea" :autosize="{maxRows:5}" placeholder="请添加商品描述"></el-input>
          </el-form-item>
          <el-form-item label="商品图片链接：" prop="imageLink">
            <el-input v-model="rulesLogic.ruleForm.imageLink" placeholder="图片链接">
              <template #prepend>https://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品数量：" prop="productCount">
            <el-input v-model.number="rulesLogic.ruleForm.productCount" type="number" placeholder="数量"></el-input>
          </el-form-item>
          <el-form-item label="商品价格：" prop="price">
            <el-input v-model.number="rulesLogic.ruleForm.price" placeholder="价格"></el-input>
          </el-form-item>
          <el-form-item label="尺寸：" prop="sizeCheckList">
            <el-checkbox-group v-model="rulesLogic.ruleForm.sizeCheckList">
              <el-checkbox v-for="item in optionList.sizeOptionList" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="品牌：" prop="brand">
            <el-input v-model="rulesLogic.ruleForm.brand" placeholder="品牌"></el-input>
          </el-form-item>
          <el-form-item label="适用季节：" prop="seasonCheckList">
            <el-checkbox-group v-model="rulesLogic.ruleForm.seasonCheckList">
              <el-checkbox v-for="item in optionList.seasonOptionList" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="领型：" prop="collarTypeCheckList">
            <el-checkbox-group v-model="rulesLogic.ruleForm.collarTypeCheckList">
              <el-checkbox v-for="item in optionList.collarTypeOptionList" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="袖长：">
            <el-select v-model="rulesLogic.ruleForm.selection">
              <el-option v-for="item in optionList.selectOption" :value="item" :label="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="cancelAdd">取消</el-button>
            <el-button type="success" @click="confirmAdd(rulesLogic.ruleForm)">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {addProductRules} from "./ruleForm";

export default defineComponent({
  name: "AddProduct",
  emits:['cancelAddClick','confirmAddClick'],
  setup(){

    let optionList = reactive({
      sizeOptionList:<string[]>['S','M','L','XL','XXL'],
      seasonOptionList:<string[]>['春季','夏季','秋季','冬季'],
      collarTypeOptionList:<string[]>['圆领','立领','V领','高领','翻领'],
      selectOption:<string[]>['三分','五分','七分','九分','长袖','长裤']
    })

    let rulesLogic =  reactive({
      addProductRules,
      ruleForm:{
        description:<string>'',
        imageLink:<string>'',
        productCount:<number>0,
        price:<number>0,
        brand:<string>'',
        sizeCheckList:<string[]>[],
        seasonCheckList:<string[]>[],
        collarTypeCheckList:<string[]>[],
        selection:<string>'五分',
      }
    })
    return {
      optionList,
      rulesLogic,
    }
  },
  methods:{
    cancelAdd(){
      this.$emit('cancelAddClick')
    },

    confirmAdd(ruleForm:any){
      //先对当前表单进行验证，若符合表单验证规则，则将当前事件发送给父组件进行下一步处理
      /**
       * 注意：当前对表单进行this.$refs['ruleForm'].validate()验证时标签中含有prop属性，但未对其制定验证规则时会处于pending状态
       * 解决：对每个标签中含有prop属性值制定验证规则，也可以将没有制定验证规则的prop进行删除
       */
      let urlRExp = new RegExp(/^(https)\:\/\/\w+/)
      this.$refs.ruleForm.validate().then(() => {
        if (ruleForm.price<=0){
          alert(`商品价格不能为${ruleForm.price}`)
        }
        else if(ruleForm.productCount <=0){
          alert(`商品数量不能为${ruleForm.productCount}`)
        }
        else if(!urlRExp.test(ruleForm.imageLink)){
          alert('图片链接格式不正确')
        }
        else {
          this.$emit('confirmAddClick',ruleForm)
        }
      }).catch((err:any) =>{
        console.log(err)
      })
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