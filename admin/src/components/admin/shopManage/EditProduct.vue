<template>
  <div class="edit-product">
    <el-row>
      <el-col :span="12">
        <el-form ref="ruleForm" v-for="item in currentProductData">
          <el-form-item label="商品ID：">
            <span>{{item.id}}</span>
          </el-form-item>
          <el-form-item label="商品描述：">
            <span>{{item.title}}</span>
          </el-form-item>
          <el-form-item label="修改商品描述：" prop="title">
            <el-input type="textarea" :autosize="{maxRows: 5}" v-model="formLogic.submitData.title"></el-input>
          </el-form-item>
          <el-form-item label="商品链接：">
            <span>{{item.imagePath}}</span>
          </el-form-item>
          <el-form-item label="修改商品图片链接：">
            <el-input v-model="formLogic.submitData.imagePath" placeholder="图片链接：">
              <template #prepend>https://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品数量：">
            <span>{{item.count}}</span>
          </el-form-item>
          <el-form-item label="修改商品数量：" prop="productCount">
            <el-input v-model.number="formLogic.submitData.count" type='number' placeholder="数量"></el-input>
          </el-form-item>
          <el-form-item label="商品价格：">
            <span>{{item.price}}</span>
          </el-form-item>
          <el-form-item label="修改商品价格：" prop="price">
            <el-input v-model.number="formLogic.submitData.price" type='number' placeholder="价格"></el-input>
          </el-form-item>
					<el-button size="small" type="warning" @click="cancelSaveOperation">取消编辑</el-button>
          <el-button size="small" type="primary" @click="submitSaveOperation(formLogic.submitData,item.id,currentProductData)">保存编辑</el-button>
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
  emits:['saveEdit','cancelEdit'],
  setup(){

    let formLogic = reactive({
      submitData:{
        title:<string>"",
        imagePath:<string>"",
        price:<string>"",
        count:<string>""
      }
    })
		
    return {
      formLogic
    }
  },
  methods:{
		cancelSaveOperation(){
			this.$emit('cancelEdit') 
		},
    submitSaveOperation(submitData:any,id:string,currentProductData:any){
      //先对当前表单进行验证，若符合表单验证规则，则将当前事件发送给父组件进行下一步处理
      let emptySubmitCount:number = 0 //存储用户未修改的数据数量

      if (this.validate(submitData)){
        //遍历submitData
				for(let k in submitData){
          //当submitData[k]中的值为空时
					if(!submitData[k]){
					  //每有一个submitData[k]数据为空时，emptySubmitCount加一
					  ++ emptySubmitCount
					  //当k等于price或者count时，将原先对应的值先进行格式化
					  if(k === 'price'){
					    submitData.price ='￥'+ currentProductData[0].price.replace('￥','')
            }
					  else if (k === 'count'){
              submitData.count = currentProductData[0].count.replace('件','')
            }
					  //其他值正常赋值
					  else {
              submitData[k] = currentProductData[0][k]
            }
					}
					//当submitData[k]值不为空，且k等于price时，对其进行格式化
					else {
            if(k === 'price' || k === 'count'){
              submitData.price ='￥'+ submitData.price.toString().replace('￥','')
            }
          }
				}
				//在submitData数据清空前保存给alterData
				let alterData = {}
				alterData.title = submitData.title
				alterData.imagePath = submitData.imagePath
				alterData.price = submitData.price
				alterData.count = submitData.count
				
				//将父组件需要用到的数据发送出去
        this.$emit('saveEdit',{submitData,id,emptySubmitCount,alterData})
				
				//Dom更新后将submitData的数据清空
				this.$nextTick(()=>{
					for(let k in submitData){
						submitData[k] = ''
					}
				})
      }
    },
    validate(validateData:any){
      /**
       * 注意：当前对表单进行this.$refs['ruleForm'].validate()验证时标签中含有prop属性，但未对其制定验证规则时会处于pending状态
       * 解决：对每个标签中含有prop属性值制定验证规则，也可以将没有制定验证规则的prop进行删除
       */
      let urlRExp = new RegExp(/^(https:)\/\/\w+/)
      if (validateData.imagePath.length>0 && !urlRExp.test(validateData.imagePath)){
        confirm('您的图片地址格式不规范哦！')
        return false
      }
      else if (validateData.price.length !=0 && validateData.price <0){
        confirm('您输入的价格不能小于0哦！')
        return false

      }
      else if(validateData.count.length !=0 && validateData.count <0){
        confirm('您输入的数量不能小于0哦！')
        return false
      }
      else {
        return true
      }
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