<template>
  <div class="add-cart">
    <div class="content">
      <div class="title"><h4>商品信息</h4></div>
      <div class="shop-info">
        <div class="image-box"><img :src="productInfo.image" alt="image"></div>
        <div class="info">
          <p class="info-title">{{productInfo.title}}</p>
          <p class="price"><span class="discount-character">￥</span>{{productInfo.price}}</p>
        </div>
      </div>
      <product-size :index="choseSizeObj.index"></product-size>
      <div class="count">
        <span class="label">数量</span>
        <count :count="count" class="count-component"></count>
      </div>
      <div class="submit">
        <button @click="submitAdd">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductSize from "@/views/detail/component/content/ProductSize";
import Count from "@/components/content/count/Count";
export default {
  name: "DetailAddCart",
  props:{
    productInfo:{
      type:Object,
      default(){
        return {}
      }
    },
    choseSizeObj:{
      type:Object,
      default() {
        return {};
      }
    }
  },
  components:{
    ProductSize,
    Count
  },
  data(){
    return {
      count:1
    }
  },
  methods:{
    //提交商品添加信息
    submitAdd(){
      this.$emit('submitAdd',{
        count:this.count,
        size:this.choseSizeObj.item
      })
    }
  },
  mounted() {
    this.$bus.$on('reduceCount',(e)=>{
      this.count = e.quantity
    })
    this.$bus.$on('addCount',(e)=>{
      this.count = e.quantity
    })
  }
}
</script>

<style scoped>
  .add-cart{
    position: fixed;
    bottom:0;
    right: 0;
    left: 0;
    min-height: 30vh;
    max-height: 70vh;
    background-color: #fff;
    z-index: 11;
  }
  .shop-info{
    display: flex;
  }
  .image-box img{
    position: relative;
    top: 1rem;
    width: 4rem;
    height: 4rem;
  }
  .info,.image-box{
    margin-left: 1rem;
  }
  .price{
    font-size: 1.3rem;
    font-weight: bold;
    color: #e02929;
  }
  .discount-character{
    font-size: .9rem;
  }
  .count{
    display:flex;
    margin: 1rem auto 0;
    width: 90%;
    height: 3rem;
  }
  .count-component{
    margin-left: 60%;
    width: 30%;
  }
  .submit{
    margin: 1rem auto;
    width: 100vw;
    height: 3rem;
  }
  .submit button{
    margin-left: 50%;
    width: 86%;
    height: 90%;
    color: #fff;
    border-radius: 2rem;
    background-color: #fd001e;
    transform: translateX(-50%);
  }
</style>