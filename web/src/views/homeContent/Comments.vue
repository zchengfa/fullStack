<template>
<div class="comments">
  <nav-bar class="nav">
    <div slot="left" @click="goBack" class="image-box">
      <img src="~assets/image/detail/back.svg" alt="back_icon">
    </div>
    <div slot="center" class="bean-progress">
      <div class="bean">
        <span class="get-bean">{{hadBean}}</span>
        <span>/20mall豆</span>
      </div>
      <div class="progress">
        <div class="progress-bg"></div>
        <div class="progress-had"></div>
      </div>
    </div>
    <div slot="right">
      <button @click="submitComments">提交</button>
    </div>
  </nav-bar>
  <div class="comments-tip">
    <span>成为评价官，可享<i>2</i>倍mall豆奖励</span>
  </div>
  <div class="comments-goods">
    <div class="product-comments">
      <comment-stars label-title="商品评价" :is-full-stars="true" @stars="stars"></comment-stars>
    </div>
    <div class="self-comments">
      <div class="textarea-box">
        <textarea v-model="comments" @focus="focusText" @blur="blurText" @input="changeComments" name="comments" id="textarea" placeholder="✎符合评价规则，评价字数超过10个即可获得mall豆~"></textarea>
      </div>
      <div class="textarea-tip" v-show="isShowTip">
        <span v-show="comments.trim().length<10">再写<span class="text-length">{{10-(comments.trim().length)}}</span>个字可获得<span class="text-length">{{10-(comments.trim().length)}}</span>mall豆</span>
        <span v-show="comments.trim().length>=10">已写<span class="text-length">{{comments.trim().length}}</span>个字，加图片/视频还可获得<span class="text-length">10</span>mall豆</span>
      </div>
      <div class="add-img-video">
        <div @click="addImage">添加图片</div>
        <div @click="addVideo">添加视频</div>
      </div>
    </div>
    <div class="comments-delivery">
      <div class="title">
        <span>物流服务评价</span>
        <span>满意请给5星哦</span>
      </div>
      <div class="content">
        <comment-stars :item="1" label-title="快递包装" @choseReason="choseReason" reason-title="packing" @stars="stars"></comment-stars>
        <comment-stars :item="2" label-title="送货速度" @choseReason="choseReason" reason-title="speed" @stars="stars"></comment-stars>
        <comment-stars :item="3" label-title="配送员服务" @choseReason="choseReason" reason-title="service"  @stars="stars"></comment-stars>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import CommentStars from "@/components/content/commentStars/CommentStars.vue";
import {backPreviousPageMixins} from "@/common/mixins/mixins";
import {submitComments} from "@/network/cart";

export default {
  name: "Comments",
  mixins:[backPreviousPageMixins],
  components:{
    NavBar,
    CommentStars
  },
  data(){
    return {
      hadBean:0,
      starsNum:[],
      reasons:[],
      comments:'',
      isShowTip:true
    }
  },
  methods:{
    submitComments(){
      let stars_num = {
        'product_stars':0,
        'packing_stars':0,
        'speed_stars':0,
        'service_stars':0,
      }
      let finishStarN = 0
      this.starsNum.map(item=>{
        if (item.reasonTitle === 'product'){
          stars_num['product_stars'] = item.stars
        }
        else if(item.reasonTitle === 'packing'){
          stars_num['packing_stars'] = item.stars
        }
        else if(item.reasonTitle === 'speed'){
          stars_num['speed_stars'] = item.stars
        }
        else if(item.reasonTitle === 'service'){
          stars_num['service_stars'] = item.stars
        }
        finishStarN++
        if (finishStarN===this.starsNum.length){
          submitComments(this.$store.state.userInfo,stars_num,this.reasons,this.comments,this.$route.query.order_id).then(res=>{
            if (res.data){
              this.$toast.showToast('评价成功，感谢您！')
              this.$nextTick(()=>{
                this.$router.back()
              })
            }
          })
        }

      })

    },
    stars(stars){

      //若用户给了四星或五星，删除之前选择过的原因
      if (stars['stars']>=4){
        this.reasons.map((item,index)=>{
          if (item['reasonTitle']===stars['reasonTitle']){
            this.reasons.splice(index,1)
          }
        })
      }
      this.starsNum.length?function (stars,_stars){
        let finishItemNum = 0
        stars.map((item,index)=>{
          if (item['reasonTitle']===_stars['reasonTitle']){
            stars[index] = _stars
          }
          else{
            finishItemNum++
          }
          finishItemNum===stars.length?stars.push(_stars):null
        })
      }(this.starsNum,stars):this.starsNum.push(stars)
    },
    choseReason(reason) {
      this.reasons.length?function (reasons,reason){
        let finishItemNum = 0
          reasons.map((item,index)=>{
            if (item['reasonTitle']===reason['reasonTitle']){
              reasons[index] = reason
            }
            else{
              finishItemNum++
            }
            finishItemNum===reasons.length?reasons.push(reason):null
          })
      }(this.reasons,reason):this.reasons.push(reason)
    },
    changeComments(){
      //去除字符串中的空格
      let trimString = this.comments.trim()
      let progressHadEl = document.getElementsByClassName('progress-had').item(0)
      let progressBgEl = document.getElementsByClassName('progress-bg').item(0)

      if (trimString.length>0 && trimString.length<=10){
        this.hadBean = trimString.length
        progressHadEl.style.width = (trimString.length*((progressBgEl.clientWidth/2)/10)) + 'px'
      }
      else if(trimString.length === 0){
        progressHadEl.style.width = '0px'
      }
      else if(trimString.length >= 10){
        progressHadEl.style.width = (progressBgEl.clientWidth/2) + 'px'
      }
    },
    focusText(){
      this.isShowTip = false
    },
    blurText(){
      this.isShowTip = true
    },
    addImage(){
      this.$toast.showToast('暂不支持添加图片')
    },
    addVideo(){
      this.$toast.showToast('暂不支持添加视频')
    }
  }
}
</script>

<style scoped>
.comments{
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 11;
}
.nav{
  border-bottom: 1px solid #f1eded;
}
.nav div{
  height: 100%;
  overflow: hidden;
}
.nav div img{
  position: relative;
  margin-top:25%;
  transform: translateY(-25%);
}
.nav button{
  color: #fd001e;
}
.bean-progress{
  position: relative;
}
.nav .bean{
  display: flex;
  justify-items: center;
  align-items: center;
  margin-left: 50%;
  height: 50%;
  font-size: .9rem;
  transform: translateX(-25%);
  line-height: 22px;
  overflow: hidden;
  letter-spacing: .05rem;
}
.bean .get-bean{
  font-size: 1.1rem;
  color: #fd001e;
}
.nav .progress{
  position: relative;
  margin-left: 50%;
  height: 50%;
  width: 4.5rem;
  transform: translateX(-50%);
}
.progress div{
  position: absolute;
  width: 100%;
  height: 40%;
  top:50%;
  transform: translateY(-50%);
  border-radius: 1rem;
  background-color: #f1edee;
}
.progress .progress-had{
  width: 0;
  background-color: #fd001e;
}
.comments-tip{
  width: 100%;
  height: 2rem;
  border-top-right-radius: .5rem;
  border-bottom-right-radius: .5rem;
  background: linear-gradient(to right, #f6e8d9, #f3cd9a);
  text-indent: 3rem;
  line-height: 2rem;
  font-size: .9rem;
  letter-spacing: .1rem;
}
.comments-tip i{
  color: #fd001e;
}
.self-comments{
  padding-bottom: .5rem;
  width: 100%;
  border-bottom-right-radius: .5rem;
  border-bottom-left-radius: .5rem;
}
.textarea-box{
  position: relative;
  margin: 0 auto;
  width: 90%;
  border-top: 1px solid #e8e6e6;
}
.textarea-box textarea{
  position: relative;
  left: 50%;
  padding: 1rem 0 0;
  width: 94%;
  border: none;
  height: 8rem;
  outline: none;
  transform: translateX(-50%);
}
.textarea-box img{
  position: absolute;
  width: 1.4rem;
  left: 0;
  top:.8rem;
}
textarea::placeholder{
  color: #b0adad;
  font-size: .9rem;
}
.textarea-tip{
  margin: 0 auto;
  width: 86%;
  font-size: .8rem;
  color: #737070;
  letter-spacing: .1rem;
}
.textarea-tip .text-length{
  color: #fd001e;
}
.add-img-video{
  margin: 1rem auto;
  display: flex;
  width: 86%;
  font-size: .9rem;
}
.comments-goods .add-img-video div{
  width: 7rem;
  height: 7rem;
  border-radius: .5rem;
  color: #8a8686;
  text-align: center;
  line-height: 7rem;
  background-color: #f5f1f1;
}
.add-img-video div:last-child{
  margin-left: .5rem;
}
.comments-goods{
  height: calc(100vh - 2rem - 45px);
  background-color: #f3eeee;
  overflow-y: scroll;
}
.comments-goods div{
  background-color: #fff;
}
.comments-goods::-webkit-scrollbar{
  display: none;
}
.comments-delivery{
  margin-top: 1rem;
  padding-bottom: 2rem;
  border-radius: .5rem;
}
.comments-delivery .title{
  position: relative;
  margin: .5rem auto;
  width: 90%;
}
.title span:last-child{
  float: right;
  color: #8a8686;
  font-size: .8rem;
}
.title span{
  display: block;
  padding: .5rem;
  float: left;
  font-size: .9rem;
}
.title::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>