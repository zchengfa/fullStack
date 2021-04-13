<template>
  <div class="add-cart">
    <div class="content">
      <div class="title"><h4>商品信息</h4></div>
      <div class="shop-info">
        <div class="image-box"><img :src="productInfo.image" alt="image"></div>
        <div class="info">
          <p class="info-title">{{productInfo.title}}</p>
          <p class="price">{{productInfo.price}}</p>
        </div>
      </div>
      <div class="count">
        <span class="label">数量</span>
        <div class="button-box">
          <button class="reduce" :disabled="count<=1" @click="reduceCount">-</button>
          <span class="quantity">{{count}}</span>
          <button class="add" @click="addCount">+</button>
        </div>
      </div>
      <div class="submit">
        <button @click="submitAdd">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailAddCart",
  props:{
    productInfo:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      count:1
    }
  },
  methods:{
    //减少数量
    reduceCount(){
      return this.count>1? this.count--:this.count=1
    },
    //增加数量
    addCount(){
      return this.count ++
    },
    //提交商品添加信息
    submitAdd(){
      this.$emit('submitAdd',this.count)
    }
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
  .count{
    margin: 1rem auto 0;
    width: 90%;
    height: 3rem;
  }
  .button-box{
    position: relative;
    left: 1rem;
    display: inline-block;
    width: 80vw;
    text-align: right;
  }
  button,.quantity{
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
  }
  button{
    font-size: 1.3rem;
    font-weight: bold;
    background-color: transparent;
  }
  .quantity{
    display: inline-block;
    text-align: center;
    background-color: #e3dede;
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