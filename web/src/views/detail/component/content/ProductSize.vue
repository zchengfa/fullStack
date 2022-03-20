<template>
  <div class="product-size">
    <slot name="title"><h3 class="title">{{title}}</h3></slot>
<!--当传过来的插槽名与尺寸名一致时才能使用该插槽-->
    <slot :name="sizeName">
      <div v-for="(item,index) in size" :class="{'active':currentIndex===index && item===sizeItem}" @click="choseSize(item,index)" :key="item+index">
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
        return '尺码/规格'
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
    shoesSize:{
      type:Array,
      default(){
        return ['35','36','37','38','39','40','41','42','43','44','45','46']
      }
    },
    fluidSize:{
      type:Array,
      default(){
        return ['50ml','100ml','150ml','200ml','250ml','300ml','500ml']
      }
    },
    littleSize:{
      type:Array,
      default(){
        return ['50g','100g','150g','200g','250g','300g']
      }
    },
    index:{
      type:Number,
      default(){
        return null
      }
    },
    itemSize:{
      type:String,
      default(){
        return ''
      }
    }
  },
  data(){
   return{
     size:[],
     isActive:false,
     currentIndex:-1,
     sizeItem:''
   }
  },
  methods:{
    choseSize(item,index){
      this.currentIndex === index?this.currentIndex = -1:this.currentIndex = index
      this.sizeItem === item?this.sizeItem = null:this.sizeItem = item
      // this.currentIndex = index
      this.currentIndex === index?this.$bus.$emit('choseSize',{item,index}):this.$bus.$emit('choseSize',{item:null,index:-1})
    }
  },
  created() {
    if (this.sizeName ==='clothes' || this.sizeName ==='pants' || this.sizeName ==='shoes' || this.sizeName ==='fluid' || this.sizeName ==='little'){
      this.sizeName==='clothes'?this.size=this.clothesSize:null
      this.sizeName==='pants'?this.size=this.pantsSize:null
      this.sizeName==='shoes'?this.size=this.shoesSize:null
      this.sizeName==='fluid'?this.size=this.fluidSize:null
      this.sizeName==='little'?this.size=this.littleSize:null

      //当父组件传入index时，直接将传过来的值赋给index
      this.currentIndex = this.index

      //当父组件传入item时就需要获取到该item在尺码中的index以及将对应的item给sizeItem
      if (this.itemSize){
        this.currentIndex = this.size.indexOf(this.itemSize)
        this.sizeItem = this.itemSize
      }
    }
    else{
      throw new Error('your sizeName is not clothes or pants or shoes or fluid or little')
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