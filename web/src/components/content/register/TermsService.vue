<template>
  <div class="terms-service">
    <nav-bar class="nav">
      <button slot="left" @click="goBack">×</button>
      <h3 slot="center">mall服务条款</h3>
    </nav-bar>
    <div class="content">
      <div class="date-address">
        <p class="version-update-date time">{{terms["version_update_date"]}}</p>
        <p class="version-use-date time" >{{terms["version_use_date"]}}</p>
        <p class="agreement-address">{{terms["agreement_address"]}}</p>
      </div>
      <div class="terms-content">
        <b class="title-important">{{termsImportant.title}}</b>
        <div class="noun">
          <h4 class="title">{{termsImportant["noun_instruction_title"]}}</h4>
          <p class="text">{{termsImportant["noun_instruction"]}}</p>
          <div class="title-children" v-for="(item,index) in termsImportant['noun_instruction_list']" :key="item[index]">
              <h4 class="title">{{getStringPre(item)}}</h4>
              <span class="terms">{{getStringLater(item)}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getTermsServiceData} from "@/network/home";
import NavBar from "@/components/common/navbar/NavBar"

export default {
  name: "TermsService",
  data(){
    return {
      terms:{},
      termsImportant:{},
    }
  },
  components:
  {
    NavBar
  },
  created() {
    console.log(666)
    getTermsServiceData().then(res =>{
      if (res.data){
        this.terms = res.data['terms_service']
        this.termsImportant = this.terms["important_knowing"]
      }
    }).catch(err =>{
      console.log(err)
    })
  },
  methods:{
    goBack() {
      this.$router.back()
    },
    getStringPre(item){
      //返回字符串冒号前（包括冒号）的字符串
      return item.terms.substring(0,(item.terms).indexOf('：')+1)
    },
    getStringLater(item){
      //返回字符串冒号后（不包括冒号）的字符串
      return item.terms.substring((item.terms).indexOf('：')+1,item.terms.length+1)
    }
  }
}
</script>

<style scoped>
.terms-service{
  position: fixed;
  top:0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  line-height: 140%;
  z-index: 16;
}
.nav{
  border-bottom: 1px solid #eae1e1;
}
.nav button{
  width: 100%;
  height: 100%;
  font-size: 3rem;
  line-height: 44px;
  font-weight: 100;
}
.nav h3{
  margin: 0 auto;
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  font-weight: normal;
  line-height: 44px;
}
.content {
  margin: 0 auto 1rem;
  width:94%;
  max-height: 90%;
  overflow: scroll;
}
.content::-webkit-scrollbar{
  display: none;
}
.time{
  color: #e32929;
}
.terms-content{
  padding-bottom: 2rem;
  font-size: .9rem;
}
.terms-content b.title-important{
  text-decoration-line:underline ;
}
.terms-content .title-children h4.title{
  margin-top: .5rem;
  margin-bottom: 0;
  display: inline-block;
}
</style>