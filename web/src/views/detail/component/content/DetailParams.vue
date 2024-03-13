<template>
<div class="params">
  <div class="title"><h4>商品参数</h4></div>
  <div class="params-box" ref="paramsBox">
    <table ref="table">
        <tr v-for="(item,index) in params" :key="item+index">
          <td class="attribute">{{item['attribute_title']}}</td>
          <td>{{item['attribute']}}</td>
        </tr>
    </table>
    <div v-show="!isExtend" @click="moreParams" class="more-params"><span>查看更多</span><img src="~assets/image/detail/arrow_down.png" alt="arrow_down"></div>
    <div v-show="isExtend"  @click="moreParams" class="more-params"><span>收起</span><img src="~assets/image/detail/arrow_up.png" alt="arrow_up"></div>
  </div>
</div>
</template>

<script>
export default {
  name: "DetailParams",
  props:{
    params:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      extendOrClose:false,
      clickCount:0,
      isExtend:false
    }
  },
  methods:{
    moreParams(){
      this.clickCount++

      if (this.clickCount%2 !==0){
        this.$refs.paramsBox.style.height = this.$refs.table.offsetHeight +30+'px'
        this.isExtend = !this.isExtend
      }
      else{
        this.$refs.paramsBox.style.height = 10+'rem'
        this.isExtend = !this.isExtend
      }
      //将刷新scroll事件发送给父组件
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>
.params-box{
  position: relative;
  height: 10rem;
  overflow: hidden;
}
table{
  margin: .2rem auto;
  width: 94%;
  border: 1px solid #c2bdbd;
  text-indent: .2rem;
  color: #8a8686;
}
table tr td{
  padding: .2rem;
  border-bottom: 1px solid #8a8686;
}
table tr:last-child td {
  border-bottom: none;
}
table tr td:first-child{
  width: 34%;
  border-right: 1px solid #8a8686;
}
.attribute{
  font-weight: bold;
  color: #413f3f;
}
.more-params{
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  font-size: .9rem;
  color: #8a8686;
  text-align: center;
  box-shadow: 1px 1px 2px #8a8686;
}
.more-params img{
  position: relative;
  top:.3rem;
  width: 1.2rem;
  height: 1.2rem;
}
</style>