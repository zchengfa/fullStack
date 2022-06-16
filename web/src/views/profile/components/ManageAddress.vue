<template>
<div class="manage-address">
  <nav-bar class="nav">
    <div slot="left" @click="back" class="back">
      <img src="~assets/image/detail/back.svg" alt="back">
    </div>
    <div slot="center">
      <span>地址管理</span>
    </div>
  </nav-bar>
  <div class="none" v-if="!address.length">暂无收货地址</div>
  <div v-else class="user-address">
    <ul>
      <li v-for="(item,index) in address" :key="index">
        <div class="address-info">
          <div class="name-phone">
            <span clss="user-name user-info">{{item.username}}</span>
            <span class="user-phone user-info">{{dealPhone(item.phone)}}</span>
          </div>
          <div class="default-complete">
            <span v-if="item.isDefault" class="default">默认</span>
            <span class="location">{{item.region+item['complete_address']}}</span>
          </div>
        </div>
        <div class="edit-address-box">
          <button class="delete-address" @click="removeUserAddress(item.id,item.user_id)">删除</button>
          <button class="edit-address" @click="showEditor(item.id)">编辑</button>
        </div>
      </li>
    </ul>
  </div>
  <div :class="{'has-address':address.length}"><button @click="addAddress" >+添加收货地址</button></div>
  <div class="address-editor" v-show="isShowEditor">
    <div class="receiver-box">
      <label for="receiver">收货人：</label>
      <input type="text" id="receiver" v-model="addressSelected.receiver">
    </div>
    <div class="receiver-box">
      <label for="phone">手机号码：</label>
      <input type="text" id="phone" v-model="addressSelected.phone">
    </div>
    <div class="receiver-box">
      <label for="region">地区：</label>
      <input type="text" id="region" v-model="addressSelected.region">
    </div>
    <div class="receiver-box">
      <label for="comAddress">详细地址：</label>
      <input type="text" id="comAddress" v-model="addressSelected.completeAddress">
    </div>
    <div class="set-default-box">
      <div class="switch-tip">
        <label for="switch">设置默认地址</label>
        <p>提醒：下单会优先使用改地址</p>
      </div>
      <input type="checkbox" id="switch" v-model="addressSelected.isDefault">
    </div>
    <button class="save-address">保存</button>
  </div>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import {getUserAddress,removeAddress} from "@/network/profile";
import {dealPhoneByStars} from "@/common/utils";

export default {
  name: "ManageAddress",
  components:{
    NavBar
  },
  data(){
    return{
      address:[],
      isShowEditor:false,
      addressSelected:{
        receiver:'',
        phone:null,
        region:'',
        completeAddress:'',
        isDefault:0,
        address_id:''
      }
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    addAddress(){
      this.$router.push('/addAddress')
    },
    //获取用户的收货地址
    getUserAddress(){
      let user_id = this.$store.state.userInfo.user_id
      getUserAddress(user_id).then(res=>{
        this.address = res.data
      })
    },
    //删除用户的收货地址
    removeUserAddress(address_id,id){
      removeAddress(address_id,id).then(res=>{
        if (res.data.remove_result){
          this.address.map((item,index)=>{
            if (address_id===item.id){
              this.address.splice(index,1)
              this.$nextTick(()=>{
                this.$toast.showToast('地址删除成功',3000,'结果：')
              })
            }
          })
        }
      })
    },
    dealPhone(phone){
      return dealPhoneByStars(phone)
    },
    showEditor(address_id){
      this.isShowEditor = true

      this.address.map(item=>{
        if (address_id===item.id){
          this.addressSelected.receiver = item.username
          this.addressSelected.phone = item.phone
          this.addressSelected.region = item.region
          this.addressSelected.completeAddress = item.complete_address
          this.addressSelected.isDefault = item.isDefault
          this.addressSelected.address_id = item.id
        }
      })
    }
  },
  created() {
    this.getUserAddress()
  }
}
</script>

<style scoped>
.manage-address{
  position: fixed;
  text-align: center;
  background-color: #eae8e8;
  width: 100vw;
  height: 100vh;
  z-index: 11;
}
.nav{
  align-items: center;
  justify-items: center;
  border-bottom: 1px solid #c5b9b9;
}
.nav{
  background-color: #fff;
}
.nav img{
  width: 2rem;
  margin-top: 25%;
  transform: translateY(-25%);
}
.none{
  margin:50% auto 1rem;
  color: #8a8686;
}
button{
  margin: 0 auto;
  padding: .5rem 1rem;
  border-radius: .5rem;
  border: 1px solid #fd001e;
  color: #fd001e;
}
.has-address{
  position: fixed;
  bottom:0;
  left: 50%;
  width: 100vw;
  height: 4rem;
  background-color: #fff;
  transform: translateX(-50%);
}
.has-address button {
  margin-top: 1rem;
  width: 80%;
}
ul{
  padding-bottom: 4rem;
  height: calc(100vh - 45px - 4rem);
  overflow: scroll;
}
ul::-webkit-scrollbar{
  display: none;
}
li{
  margin-top: 1rem;
  background-color: #fff;
}

li .address-info{
  padding: 1rem 0;
  border-bottom: 1px solid #cbc5c5;
}
.address-info div {
  text-align: left;
}
.address-info div span{
  display: inline-block;
  margin-left: 1rem;
  padding: .5rem 0;
}
.address-info div .default{
  padding: .2rem;
  background-color: #ee3f30;
  color: #fff;
  border-radius: .2rem;
}
li button{
  margin-right: 1rem;
  border:1px solid #010915;
  border-radius: .5rem;
  color: #3b75d9;
}
.edit-address-box{
  padding: .5rem 0;
  text-align: right;
}
.edit-address{
  color: #fd001e;
  border-color: #fd001e;
}
.user-phone{
  color: #8a8686;
}
.address-editor{
  position: absolute;
  top:44px;
  left: 0;
  width: 100%;
  height: calc(100% - 44px);
  background-color: #fff;
  z-index: 15;
}
.address-editor div{
  padding: 1rem;
  width: 90%;
  margin: 0 auto;
  text-align: left;
}
.address-editor label{
  display: inline-block;
  min-width: 80px;
  color: #5e5b5b;
  text-align: right;
}
.address-editor input{
  font-weight: bold;
}
.set-default-box .switch-tip{
  display: inline-block;
  padding-left: 0;
  padding-right: 0;
  width: auto;
}
.switch-tip p{
  color: #8a8686;
  font-size: 12px;
}
#switch{
  position: relative;
  left: 40%;
  width: 3rem;
  height: 1.2rem;
  outline: none;
  border-radius: 1rem;
  appearance: none;
  -webkit-appearance: none;
  background-color: #aba8a8;
  transition: all .2s ease;
  transform: translateY(-50%);
}
#switch::after{
  position: absolute;
  top:0;
  left: 0;
  content: '';
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-radius: 1rem;
  transition: all .2s ease;
}
#switch:checked{
  background-color: #fd001e;
}
#switch:checked::after{
  left: 50%;
}
.save-address{
  width: 60%;
  background-color: #fd001e;
  color: #fff;
}
</style>