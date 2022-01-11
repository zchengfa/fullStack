<template>
  <div class="product-size">
    <slot name="title"><h3 class="title">{{title}}</h3></slot>
<!--当传过来的插槽名与尺寸名一致时才能使用该插槽-->
    <slot :name="sizeName">
      <div v-for="(item,index) in size" :class="{'active':currentIndex===index}" @click="choseSize(item,index)" :key="item+index">
        <span>{{item}}</span>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "ProductSize",
  props:{
    name:{
      type:String,
      default(){
        return ''
      }
    },
    sizeName:{
      type:String,
      default(){
        return 'clothes'
      }
    },
    title:{
      type:String,
      default(){
        return '尺码'
      }
    },
    clothesSize:{
      type:Array,
      default() {
        return ['X','M','L','XL','XXL'];
      }
    },
    pantsSize:{
      type:Array,
      default(){
        return ['28','29','30','31','32','33','34','36','38','40','42','44']
      }
    },
    index:{
      type:Number,
      default(){
        return null
      }
    }
  },
  data(){
   return{
     size:[],
     isActive:false,
     currentIndex:-1,
     clickCount:0
   }
  },
  methods:{
    choseSize(item,index){
      this.clickCount++
      this.currentIndex === index?this.currentIndex = -1:this.currentIndex = index
      // this.currentIndex = index
      this.currentIndex === index?this.$bus.$emit('choseSize',{item,index}):this.$bus.$emit('choseSize',{item:null,index:-1})
    }
  },
  created() {
    if (this.sizeName ==='clothes' || this.sizeName ==='pants'){
      this.sizeName==='clothes'?this.size=this.clothesSize:this.size=this.pantsSize
      this.currentIndex = this.index
    }
    else{

      throw new Error('your sizeName is not clothes or pants')
    }


  }
}
</script>

<style scoped>
.product-size  div.active{
  border: 1px solid #fd001e;
  color: #d72957;
}
.product-size{
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
  width: 96%;
  text-align: center;
  font-size: .8rem;
  color: #6c6a6a;
}
.title{
  width: 100%;
  text-align: left;
  text-indent: 1rem;
}
.product-size div{
  margin: .5rem 1rem;
  padding: .4rem;
  width: 24%;
  border: 1px solid #afaaaa;
  border-radius: .2rem;
}
.product-size div span{
  display: inline-block;
  width: 100%;
  height: 100%;
}
</style>