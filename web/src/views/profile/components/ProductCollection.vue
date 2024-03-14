<template>
  <div class="product-collection">
    <none-data></none-data>
  </div>
</template>

<script>
import NoneData from "../../../components/content/NoneData/NoneData.vue";

export default {
  name: "ProductCollection",
  components: {NoneData}
}
</script>

<style scoped>
.product-collection{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>