<template>
<div class="change-size">
  <div class="product-box" >
    <div class="product-image"><img :src="productImage" alt="productImage"></div>
    <product-size class="product-size-component" :item-size="item"></product-size>
    <div class="submit-change-size"><button @click.once="submitChangeSize">确定</button></div>
  </div>
</div>
</template>

<script>
import ProductSize from "@/views/detail/component/content/ProductSize";
export default {
  name: "ChangeSize",
  props:{
    productImage:{
      type:String,
      default(){
        return ''
      }
    },
    item:{
      type:String,
      default() {
        return "";
      }
    },
    proId:{
      type:String,
      default(){
        return ''
      }
    }
  },
  data(){
    return {
      size:'',
      sizeIndex:-1
    }
  },
  components:{
    ProductSize
  },
  methods:{
    submitChangeSize(){
      if (!this.size && this.sizeIndex ===-1){
        this.$toast.showToast('请选择尺码')
      }
      else {
        this.$bus.$emit('submitChangeSize',{'size':this.size,'proId':this.$props.proId})
      }

    }
  },
  created() {
    this.size = this.$props.item
  },
  mounted() {
    this.$bus.$on('choseSize',(e)=>{
      this.size = e.item
      this.sizeIndex = e.index
    })
  }
}
</script>

<style scoped>
.change-size{
  width: 100%;
  height: 100%;
}
.product-box{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 45%;
  background-color: #fff;
}
.product-image{
  width: 6rem;
  margin-top: -3rem;
  margin-left: 2rem;
  border: 2px solid #fd001e;
}
.product-image img{
  width: 100%;
}
.product-size-component,.submit-change-size{
  margin-top: 10%;
}
.submit-change-size{
  text-align: center;
}
.submit-change-size button{
  width: 70%;
  height: 2rem;
  background-color: #fd001e;
  color: #fff;
  border-radius: 1rem;
}
</style>