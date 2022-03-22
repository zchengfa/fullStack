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
            <span class="user-phone user-info">{{item.phone}}</span>
          </div>
          <div class="default-complete">
            <span v-show="item.isDefault" class="default">默认</span>
            <span class="location">{{item.region+item['complete_address']}}</span>
          </div>
        </div>
        <div class="edit-address">
          <button>删除</button>
          <button>编辑</button>
        </div>
      </li>
    </ul>
  </div>
  <div :class="{'has-address':address.length}"><button @click="addAddress" >+添加收货地址</button></div>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import {getUserAddress} from "@/network/profile";

export default {
  name: "ManageAddress",
  components:{
    NavBar
  },
  data(){
    return{
      address:[]
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
        this.address.map(item =>{
          //手机号码带*处理
          item.phone = item.phone.replace(/(\d{3})\d*(\d{4})/,'$1*****$2')
        })
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
  background-color: #3b75d9;
  color: #fff;
  border-radius: .2rem;
}
li button{
  margin-right: 1rem;
  border:1px solid #010915;
  border-radius: 1rem;
  color: #3b75d9;
}
.edit-address{
  padding: 1rem 0;
  text-align: right;
}
</style>