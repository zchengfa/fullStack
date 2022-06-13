<template>
  <div class="edit-product">
    <el-row class="edit-row">
      <el-col :span="12" class="edit-col">
        <el-form ref="ruleForm" v-for="item in currentProductData" class="edit-form">
          <el-form-item>
            <span slot="label" class="edit-label">商品ID：</span>
            <span slot="default" class="edit-label-content">{{item.id}}</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="edit-label">商品描述：</span>
            <span slot="default" class="edit-label-content edit-label-title">{{item.title}}</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="edit-alter-label">修改商品描述：</span>
            <el-input slot="default" class="edit-alter-input" type="textarea" :autosize="{maxRows: 5}" v-model="formLogic.submitData.title"></el-input>
          </el-form-item>
          <el-form-item >
            <span slot="label" class="edit-label">商品链接：</span>
            <span slot="default" class="edit-label-content edit-label-link">{{item.imagePath}}</span>
          </el-form-item>
          <el-form-item class="edit-form-link">
            <span slot="label" class="edit-alter-label">修改商品链接：</span>
            <span class="edit-link">https://</span>
            <el-input class="edit-alter-input" v-model="formLogic.submitData.imagePath" placeholder="图片链接："></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="edit-label">商品数量：</span>
            <span slot="default" class="edit-label-content">{{item.count}}</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="edit-alter-label">修改商品数量：</span>
            <el-input class="edit-alter-input" v-model.number="formLogic.submitData.count" type='number' placeholder="数量"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="edit-label">商品价格：</span>
            <span slot="default" class="edit-label-content">{{item.price}}</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="edit-alter-label">修改商品价格：</span>
            <el-input class="edit-alter-input" v-model.number="formLogic.submitData.price" type='number' placeholder="价格"></el-input>
          </el-form-item>
					<el-button size="small" type="warning" @click="cancelSaveOperation">取消编辑</el-button>
          <el-button size="small" type="primary" @click="submitSaveOperation(formLogic.submitData,item.id,currentProductData)">保存编辑</el-button>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";

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
              submitData.price =submitData.price.toString().replace('￥','')
            }
          }
				}

				//在submitData数据清空前保存给alterData
				let alterData = {
				  title:<string>'',
          imagePath:<string>'',
          price:<string>'',
          count:<number>0
        }
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
  width: 100%;
  height: 100%;
  background-color: rgba(211,211,220,.5);
  z-index: 9;
  overflow: hidden;
}
.edit-row{
  width: 100%;
  height: 100%;
}
.edit-col{
  display: flex;
  margin: auto;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #fff;

}
.edit-form{
  width: 80%;
  overflow: hidden;
}
.edit-label,.edit-label-content{
  display: block;
  float: left;

}
.edit-label,.edit-alter-label{
  width: 20%;
  text-align: right;
	font-weight: bold;
}
.edit-label-content,.edit-alter-input{
  width: 60%;
  text-align: left;
  text-indent: 1rem;
	color: #989898;
}
.edit-alter-label,.edit-alter-input{
  display: inline-block;
}
.edit-label-link,.edit-label-title{
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.edit-link{
  position: absolute;
  display: inline-block;
  width: 10%;
  height: 96%;
	min-width: 52px;
	max-height: 40px;
  left: 20%;
  z-index: 9;
  color: #dc2222;
  border: 1px solid #a9a9a9;
  background-color: #64a8ec;
}

.edit-form-link .edit-alter-input{
  text-indent: 15%;
}
.edit-alter-label,
.edit-alter-input{
	float: left;
}
</style>