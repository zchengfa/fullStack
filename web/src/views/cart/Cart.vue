<template>
	<div class="nav-cart">
    <nav-bar>
      <div slot="center">
        <div class="nav-title">购物车</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar"

  export  default {
    name:'Cart',
    components:{
      NavBar
    }
  }
</script>

<style>
  .nav-cart{
    background-color: #db7093;
  }
  .nav-title{
    color: #fff;
  }

</style>
