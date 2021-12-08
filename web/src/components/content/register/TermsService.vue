<template>
  <div class="terms-service">{{terms}}</div>
</template>

<script>
import {getTermsServiceData} from "@/network/home";

export default {
  name: "TermsService",
  data(){
    return {
      terms:{}
    }
  },
  created() {
    console.log(666)
    getTermsServiceData().then(res =>{
      console.log(res.data)
      if (res.data){
        this.terms = res.data
      }
    }).catch(err =>{
      console.log(err)
    })
  }
}
</script>

<style scoped>
.terms-service{
  position: fixed;
  top:0;
  width: 100vw;
  height: 100vh;
  z-index: 16;
  overflow: scroll;
}
</style>