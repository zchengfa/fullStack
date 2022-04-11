<template>
<div class="comment-stars">
  <div v-if="!$props.disabled">
    <div class="stars-box">
      <div><label>{{$props.labelTitle}}</label></div>
      <div class="stars">
        <div v-for="(item,index) in $props.commentsFeeling" :key="index" @click="stars(index)" class="image-box">
          <img class="stars-image" alt="stars">
        </div>
      </div>
      <div class="feeling-box"><span v-if="feeling.length" class="feeling">{{feeling}}</span></div>
    </div>
    <div class="reason-box">
      <div v-if="$props.reasonTitle==='packing'">
        <button class="reason" @click="choseReason($props.reasonTitle,$props.packingReasonList,packingIndex)" :class="{'active':packing['isSelected']}" v-show="isShowReason" v-for="(packing,packingIndex) in $props.packingReasonList" :key="packingIndex">{{packing['title']}}</button>
      </div>
      <div v-if="$props.reasonTitle==='speed'">
        <button @click="choseReason($props.reasonTitle,$props.speedReasonList,speedIndex)" v-show="isShowReason" :class="{'active':speed['isSelected']}" v-for="(speed,speedIndex) in $props.speedReasonList" :key="speedIndex">{{speed['title']}}</button>
      </div>
      <div v-if="$props.reasonTitle==='service'">
        <button @click="choseReason($props.reasonTitle,$props.serviceReasonList,serviceIndex)" v-show="isShowReason" :class="{'active':service['isSelected']}" v-for="(service,serviceIndex) in $props.serviceReasonList" :key="serviceIndex">{{service['title']}}</button>
      </div>
    </div>
  </div>
  <div v-else class="stars-box">
    <div class="stars disabled-stars">
      <div v-for="(item,index) in starsNums" :key="index" class="image-box">
        <img :src="starsNums_icon" class="disabled-image" alt="stars">
      </div>
    </div>
  </div>
</div>
</template>
<script>
import base64 from '@/assets/image/base64/base64'
export default {
  name: "CommentStars",
  props:{
    labelTitle:{
      type:String,
      default(){
        return '评价'
      }
    },
    commentsFeeling:{
      type:Array,
      default() {
        return ['非常差','差','一般','好','非常好'];
      }
    },
    isFullStars:{
      type:Boolean,
      default(){
        return false
      }
    },
    item:{
      type:Number,
      default(){
        return 0
      }
    },
    reasonTitle:{
      type:String,
      default(){
        return 'product'
      }
    },
    packingReasonList:{
      type:Array,
      default(){
        return [{'title':'商品脏污','isSelected':false},{'title':'快递包装破损','isSelected':false},{'title':'快递包装简陋','isSelected':false},{'title':'快递包装脏污','isSelected':false},{'title':'包裹内填充物过少','isSelected':false}]
      }
    },
    speedReasonList:{
      type:Array,
      default(){
        return [{'title':'送货速度慢','isSelected':false},{'title':'发货速度慢','isSelected':false},{'title':'预计送达时间不准确','isSelected':false}]
      }
    },
    serviceReasonList:{
      type:Array,
      default(){
        return [{'title':'未经允许私放自提','isSelected':false},{'title':'附近没有自提点/柜','isSelected':false},{'title':'不送货上门','isSelected':false},{'title':'私自退货','isSelected':false},{'title':'服务态度不好','isSelected':false},{'title':'未收货已签收','isSelected':false}]
      }
    },
    disabled:{
      type:Boolean,
      default(){
        return false
      }
    },
    starsNum:{
      type:Number,
      default(){
        return 5
      }
    }
  },
  data(){
    return {
      feeling:'',
      isShowReason:false,
      reason:[],
      starsNums:[],
      starsNums_icon:''
    }
  },
  methods:{
    stars(index){
      for (let i = 0; i < this.$props.commentsFeeling.length; i++) {
        let imgEl = document.getElementsByClassName('stars').item(this.$props.item).children.item(i).children.item(0)
        if (i<=index){
          imgEl.src = base64['stars']['active']
          imgEl.className = 'image-animation'
          let timer = setTimeout(()=>{
            imgEl.className = 'stars-image'
            clearTimeout(timer)
          },1000)
        }
        else {
          imgEl.src = base64['stars']['normal']
        }
      }
      this.feeling = this.$props.commentsFeeling[index]

      //当评价星数小于等于3星的时候，显示原因选择项
      index<=2?this.isShowReason = true:this.isShowReason = false

      //将事件发送给父组件，并且将值（第几个组件发出的，评价星数，组件label标题 ）出给父组件
      this.$emit('stars',{'stars':index+1,'labelTitle':this.$props.labelTitle,'reasonTitle':this.$props.reasonTitle})
    },
    choseReason(reasonTitle,list,index){
      let reason = []
      list.map((_item,_index)=>{
        if (_index===index){
          _item['isSelected'] ? _item['isSelected'] = false : _item['isSelected'] = true
        }
        if (_item['isSelected']){
          reason.push(_item['title'])
        }
      })
      this.$emit('choseReason',{'reasonTitle':reasonTitle,'reason':reason,'labelTitle':this.$props.labelTitle})
    }
  },
  created() {
    for (let i = 0; i < this.$props.starsNum; i++) {
      this.starsNums.push(i)
    }
    this.starsNums_icon = base64['stars']['active']
  },
  mounted() {
    if (!this.$props.disabled){
      let imgElNum = document.getElementsByClassName('stars').item(this.$props.item).childElementCount
      if (this.$props.isFullStars){
        for (let i = 0; i < imgElNum; i++) {
          let imgEl = document.getElementsByClassName('stars').item(this.$props.item).children.item(i).children.item(0)
          imgEl.src = base64['stars']['active']
        }
        this.feeling = this.$props.commentsFeeling[this.$props.commentsFeeling.length-1]
      }
      else {
        for (let i = 0; i < imgElNum; i++) {
          let imgEl = document.getElementsByClassName('stars').item(this.$props.item).children.item(i).children.item(0)
          imgEl.src = base64['stars']['normal']
        }
      }

      //如果是商品评价，页面挂载完后发送事件给父组件，告诉父组件默认是五星
      if (this.$props.reasonTitle === 'product'){
        this.$emit('stars',{'stars':5,'labelTitle':this.$props.labelTitle,'reasonTitle':this.$props.reasonTitle})
      }
    }
  }
}
</script>

<style scoped>
.active{
  color: #fd001e;
  border: 1px solid #fd001e;
  background-color: #fae2e5 !important;
}
.comment-stars{
  padding-top: .5rem;
  padding-bottom: .5rem;
  font-size: .9rem;
}
.stars-box,
.stars-box div.stars,
.reason-box div{
  display: flex;
  justify-items: center;
  align-items: center;
  text-align: center;
}
.stars-box div:first-child{
  position: relative;
}
.stars-box label{
  float: left;
  margin-left: 2rem;
}
.comment-stars .stars-box div{
  flex: 1;
  height: 1.6rem;
  line-height: 1.8rem;
}
.comment-stars .stars-box .stars{
  flex: 1.4;
}
.stars div{
  position: relative;
}
.stars img{
  position: relative;
  top: 50%;
  width: 1.4rem;
  transform: translateY(-50%);
}
.image-animation{
  animation: stars 1s ease-in;
}
.comment-stars .feeling-box{
  text-align: left;
  text-indent: 1rem;
}
.feeling{
  color: #cec7c7;
}
.reason-box div{
  margin-top: .5rem;
  margin-left: .5rem;
  flex-wrap: wrap;
}
.reason-box div button{
  margin-left: 1rem;
  margin-top: .5rem;
  padding: .5rem .5rem;
  font-size: 12px;
  border-radius: 1rem;
  background-color: #f8f3f3;
}
.comment-stars .stars-box .disabled-image{
  top:0;
  width: .8rem;
}
.comment-stars .stars-box .disabled-stars{
  height: .8rem;
}
.stars-box .disabled-stars .image-box{
  height: .8rem;
}
@keyframes stars {
  0%{
    width: 1.4rem;
  }
  50%{
    width: 1.6rem;
  }
  100%{
    width: 1.4rem;
  }
}
</style>