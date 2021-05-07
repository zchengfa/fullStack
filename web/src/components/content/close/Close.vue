<template>
  <div class="close" @click="close">×</div>
</template>

<script>
export default {
  name: "Close",
  methods:{
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.close{
  position: fixed;
  top:1rem;
  left: 1rem;
  width: 3rem;
  height: 3rem;
  color: #fff;
  border-radius: 50%;
  font-size: 2rem;
  text-align: center;
  line-height: 3rem;
  background-color: rgba(26, 25, 25, 0.5);
  z-index: 20;
}
</style>