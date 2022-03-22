<template>
  <div class="menu">
    <div class="menu-content">
      <div>
        <img :src="meansList['coupon']" alt="coupon">
        <p>优惠券</p>
      </div>
      <div>
        <img :src="meansList['mall_coin']" alt="mall_coin">
        <p>mall币</p>
      </div>
      <div>
        <img :src="meansList['borrow_money']" alt="borrow_money">
        <p>借钱</p>
      </div>
      <div>
        <img :src="meansList['small_change']" alt="small_change">
        <p>零钱</p>
      </div>
      <div>
        <img :src="meansList['my_assets']" alt="my_assets">
        <p>我的资产</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MeansMenu",
  props:{
    meansList:{
      type:Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.menu {
  padding: 1rem 0;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 96vw;
  font-size: .8rem;
  text-align: center;
  border-radius: .5rem;
}
.menu-content{
  display: flex;
  justify-items: center;
  align-items: center;
}
.menu-content div{
  flex: 1;
}
</style>