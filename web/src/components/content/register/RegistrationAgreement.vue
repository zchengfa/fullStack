<template>
  <div class="registration-agreement" v-if="isAgree">
    <div class="content-box">
      <div class="title"><h3>注册协议及隐私政策</h3></div>
      <div class="content">在您注册成为mall用户的过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，
        <span class="warning underline">请您务必仔细阅读、充分理解协议中的条款内容后再点击同意（尤其是以粗体并下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）</span>:
        <div class="agreement-box">
          <p><router-link class="agreement underline" :to="{path:'/termsService'}">《mall服务条款》</router-link></p>
          <p><router-link class="agreement underline" :to="{path:'/termsService'}">《隐私条款》</router-link></p>
          <p><router-link class="agreement underline" :to="{path:'/termsService'}">《mall支付服务协议》</router-link></p>
        </div>
        <p class="warning underline">【请您注意】 如果您不同意以上协议或其中任何条款约定、请您停止注册。您停止注册后将仅可以浏览我们的商品信息但无法享受我们的产品或服务。如果您按照注册流程提示填写信息、阅读并点击同意上述协议且完成全部注册流程后，即表示您已充分阅读、理解并接受协议的全部内容；并表明您也同意mall可以依据以上隐私政策内容来处理您的个人信息。 如您对以上协议内容有任何疑问，您随时可与mall客服联系。
        </p>
      </div>
      <div class="tip"> <p>
        i 点击同意即表示您已阅读并同意
        <router-link class="agreement" to="/">《mall服务条款》、</router-link>
        <router-link class="agreement" to="/">《隐私条款》、</router-link>
        <router-link class="agreement" to="/">《mall支付服务协议》</router-link>
      </p>
      </div>
      <div class="selection-box">
        <button class="disagree" @click="disagree">不同意</button>
        <button class="agree" @click="agree">同意</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegistrationAgreement",
  data(){
    return {
      isAgree:true
    }
  },
  methods:{
    disagree(){
      //点击不同意按钮，返回上一页面
      this.$router.go(-1)
    },
    agree(){
      //点击同意按钮，关闭当前组件
      this.isAgree = false
    }
  }
}
</script>

<style scoped>
.registration-agreement{
  position: fixed;
  display: flex;
  top: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(45, 41, 41, 0.8);
  font-size: .9rem;
  color: #504e4e;
  line-height: 145%;
  text-align: left;
  z-index: 16;
}
p{
  margin:0 auto .5rem;
}
h3{
  font-weight: unset;
  color: #000;
  text-align: center;
}
.content-box{
  width: 75%;
  background-color: #fff;
  border-radius: .8rem;
}
.content{
  margin: 0 auto;
  width: 80%;
  max-height: 18rem;
  overflow: scroll;
  -ms-overflow-style: none;
}
.content::-webkit-scrollbar{
  display: none;
}
.warning{
  color: #000;
}
.underline{
  font-weight: bolder;
  text-decoration-line: underline;
}
.tip{
  background-color: rgba(138, 134, 134, 0.2);
}
.tip p{
  margin: 0 auto;
  padding-top: .5rem;
  padding-bottom: .5rem;
  width: 80%;
}
.agreement-box{
  margin-top: .5rem;
}
.agreement{
  color: #1e8efc;
}
.selection-box{
  display: flex;
  width: 100%;
  height: 3rem;
}
.disagree,.agree{
  flex: 1;
  font-size: 1rem;
}
.disagree{
  color: #8a8686;
}
.agree{
  background-color: #f6178e;
  color: #fff;
  border-bottom-right-radius: .8rem;
}
</style>