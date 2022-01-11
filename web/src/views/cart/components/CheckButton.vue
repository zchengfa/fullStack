<template>
  <div class="check-button" :class="{checked:isChecked}">
    <button ></button>
  </div>

</template>

<script>
export default {
  name: "CheckButton",
  props:{
    isChecked:{
      type:Boolean,
      default(){
        return false
      }
    }
  }
}
</script>

<style scoped>
.check-button{
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background-image: url("~assets/image/cart/check.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
}
.checked{
  background-image: url("~assets/image/cart/checked.png");
}
</style>