<template>
  <div class="check-button">
    <button :class="{checked:isChecked}"></button>
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
  button{
    position: relative;
    top: 50%;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-image: url("~assets/image/cart/check.svg");
    transform: translateY(-50%);
  }
  .checked{
    background-image: url("~assets/image/cart/checked.svg");
  }
</style>