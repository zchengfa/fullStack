<template>
  <div class="menu-list">
    <div class="menu-content">
      <div>
        <img :src="menuList['member_club']" alt="member_club">
        <p>会员俱乐部</p>
      </div>
      <div>
        <img :src="menuList['public_welfare']" alt="public_welfare">
        <p>我的公益</p>
      </div>
      <div>
        <img :src="menuList['Q&A']" alt="Q&A">
        <p>我的问答</p>
      </div>
      <div>
        <img :src="menuList['account_security']" alt="account_security">
        <p>账号与安全</p>
      </div>
      <div @click="contactCustomer">
        <img :src="menuList['customer_service']" alt="customer_service">
        <p>mall客服</p>
      </div>
      <div>
        <img :src="menuList['shopping_for_refund']" alt="shopping_for_refund">
        <p>购物返现</p>
      </div>
      <div>
        <img :src="menuList['phone_replenishing']" alt="phone_replenishing">
        <p>手机充值</p>
      </div>
    </div>
  </div>
</template>

<script>
  // import {adjustIsLoginMixins} from "@/common/mixins/mixins";

  export default {
    name: "MenuList",
    //mixins:[adjustIsLoginMixins],
    props:{
      menuList:{
        type:Object,
        default() {
          return {}
        }
      }
    },
    methods:{
      //联系客服
      contactCustomer(){
        this.$emit('contactCustomer')
      }
    }
}
</script>

<style scoped>
.menu-list{
  width: 100%;
  min-height: 10rem;
}
.menu-content{
  display: flex;
  justify-items: center;
  align-items: center;
  flex-wrap: wrap;
  width: 98%;
  margin: 0 auto;
}
.menu-content div{
  width: 20%;
  text-align: center;
}
.menu-content div img{
  width: 2rem;
  height: 2rem;
}
.menu-content div p{
  margin: .8rem auto;
  font-size: .8rem;
}
</style>
