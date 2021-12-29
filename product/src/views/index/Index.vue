<template>
  <el-container>
    <el-form ref="form" :model="formLogic.forms" :rules="formLogic.formRules">
      <el-form-item label="商品描述：" prop="description">
        <el-input v-model="formLogic.forms.description" type="textarea" :autosize="{maxRows:5}" placeholder="请添加商品描述"></el-input>
      </el-form-item>
      <el-form-item label="商品图片链接：" prop="imagePath">
        <el-input v-model="formLogic.forms.imagePath" placeholder="图片链接">
          <template #prepend>https://</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品价格：" prop="imagePath">
        <el-input v-model.number="formLogic.forms.price" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="商品类型：" prop="imagePath">
        <el-input v-model="formLogic.forms.type" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="imagePath">
        <el-input v-model="formLogic.forms.brand" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="商品喜爱数：" prop="imagePath">
        <el-input v-model.number="formLogic.forms.favorite" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="商品评论数：" prop="imagePath">
        <el-input v-model.number="formLogic.forms.comments" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="商品库存：" prop="imagePath">
        <el-input v-model.number="formLogic.forms.stocks" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="商品计数单位：" prop="imagePath">
        <el-input v-model="formLogic.forms.unit" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="是否有优惠：" prop="imagePath">
        <el-input v-model="formLogic.forms.isPreferential" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="优惠类型：" prop="imagePath">
        <el-input v-model="formLogic.forms.preferential_type" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="是否热卖：" prop="imagePath">
        <el-input v-model="formLogic.forms.isHot" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="销量：" prop="imagePath">
        <el-input v-model="formLogic.forms.sales" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item label="售卖类型：" prop="imagePath">
        <el-input v-model="formLogic.forms.sell_type" placeholder="价格">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="confirmAdd(formLogic.forms)">添加</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script lang="ts">
import {defineComponent,reactive} from "vue";
import {ElContainer,ElCol,ElRow,ElForm,ElFormItem} from 'element-plus'
import {formRules} from "./formRules";
import {submitData} from "../../network/network";

export default defineComponent({
  name: "Index",
  components:{
    ElContainer,
    ElCol,
    ElRow,
    ElForm,
    ElFormItem
  },
  setup(){
    let formLogic = reactive({
      forms:{
        description:<string>'',
        imagePath:<string>'',
        price:<number>0,
        brand:<string>'',
        favorite:<number>0,
        comments:<number>0,
        stocks:<number>0,
        isPreferential:<string>'是',
        preferential_type:<string>'满减',
        isHot:<string>'是',
        sales:<number>0,
        sell_type:<string>'new'
      },
      formRules
    })

    return {
      formLogic
    }
  },
  methods:{
    confirmAdd(form:any){
      this.$refs.form.validate().then(()=>{
        submitData(form).then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
      }).catch((err:any)=>{
        console.log(err)
      })
    }
  }
})
</script>

<style scoped lang="sass">
$redColor: #dc1616
.test
  color: $redColor
</style>