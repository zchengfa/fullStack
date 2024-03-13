<template>
<div class="add-address">
  <nav-bar class="nav">
    <div slot="left" @click="back" class="back">
      <img src="~assets/image/detail/back.svg" alt="back">
    </div>
    <div slot="center">
      <span>新增地址</span>
    </div>
  </nav-bar>
  <div class="content">
    <div class="receiver-phone">
      <div class="receiver">
        <span>收货人</span>
        <input type="text" placeholder="请输入收货人姓名" v-model="username">
      </div>
      <div class="phone">
        <span>手机号</span>
        <input type="number" placeholder="请输入收货人手机号" v-model.number="phone">
      </div>
    </div>
    <div class="address">
      <div class="region">
        <span>所在地区</span>
<!--        <button v-show="!region" @click="showRegion">所在地区</button>-->
<!--        <span v-show="region">{{region}}</span>-->
        <input type="text"  v-model="region" placeholder="所在地区">
      </div>
      <div class="complete-address">
        <span>详细地址</span>
        <input type="text" placeholder="请输入详细地址" v-model="completeAddress">
      </div>
    </div>
    <div class="confirm-add">
      <button @click="confirmAddAddress">确定</button>
    </div>
  </div>
<!--  <region @closeRegion="closeRegion" class="region-component" v-show="isShowRegion"></region>-->
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import {addAddress} from "@/network/profile";
//import Region from "@/components/content/region/Region";
export default {
  name: "AddAddress",
  components:{
    NavBar,
    //Region
  },
  data(){
    return {
      username:'',
      phone:'',
      region:'',
      completeAddress:'',
      isShowRegion:false
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    confirmAddAddress(){
      if (this.username&&this.phone&&this.region&&this.completeAddress){
        if (this.phone.toString().length !==11){
          this.$toast.showToast('您的手机号格式错误')
        }else{
          let user_id = this.$store.state.userInfo.user_id
          let info = {
            'username':this.username,
            'phone':this.phone,
            'region':this.region,
            'completeAddress':this.completeAddress,
            user_id
          }

          addAddress(info).then(res=>{
            if (res.data.code===200){
              this.$router.go(-1)
            }
          })
        }
      }
      else{
        this.$toast.showToast('请将信息完善')
      }
    },
    showRegion(){
      this.isShowRegion = true
    },
    closeRegion(){
      this.isShowRegion = false
    }
  }
}
</script>

<style scoped>
.add-address{
  width: 100vw;
  height: 100vh;
  background-color: #e0dddd;
}
.nav{
  margin-top: 0;
  align-items: center;
  justify-items: center;
  border-bottom: 1px solid #c5b9b9;
}
.nav{
  background-color: #fff;
}
.nav img{
  transform: scale(.7);
}
.add-address .content div{
  margin-top: 1rem;
  width: 100%;
  background-color: #fff;
}
.add-address .content div div{
  margin-top: 0;
  height: 3rem;
  border-bottom: 1px solid #d7d3d3;
}
.confirm-add{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 3rem;
  z-index: 12;
}
.confirm-add button{
  width: 80%;
  height: 2rem;
  border-radius: 1rem;
  background-color: #fd001e;
  color: #fff;
}
.content input{
  height: 90%;
  overflow: hidden;
}
.content input,.content span{
  margin-left: 1rem;
  font-size: .9rem;
}
.region button{
  margin-left: 1rem;
  height: 3rem;
  color: #918b8b;
}
.region-component{
  position: fixed;
  top:0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(190, 180, 180, 0.6);
  z-index: 12;
}
</style>