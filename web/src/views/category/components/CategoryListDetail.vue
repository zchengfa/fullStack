<template>
  <div class="category-list-detail">
    <div class="list-item" v-for="(item, index) in categoryListDetail" :key="index">
      <div class="title"><h4>{{item.title}}</h4><a :href="item.router">热销榜> </a></div>
      <div class="content" v-for="(items,index) in item.content" :key="index">
        <a  @click="tip">
          <div class="image-box"><img :src="items.image" alt="image" @load="imageLoadOver"></div>
          <p class="detail-title">{{items.title}}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryListDetail",
  props:{
    categoryListDetail:{
      type:Array,
      default() {
        return []
      }
    }
  },
  methods:{
    imageLoadOver(){
      this.$emit('imageLoad')
    },
    tip(){
      this.$toast.showToast('您点击的商品类型下的商品暂无，请等待开发者完善！',2000,'非常抱歉')
    }
  }
}
</script>

<style scoped>
.list-item {
  width: 100%;
  text-align: center;
}
.list-item .title{
  text-align: left;
  text-indent: .5rem;
}

.list-item .content {
  display: inline-block;
  width: 30%;
  text-align: center;
  font-size: .8rem;
}
.list-item .title h4{
  display: inline-block;
  width: 60%;
}
.list-item .title a{
  display: inline-block;
  width: 30%;
  font-size: .8rem;
  text-align: right;
}
.content a {
  display: block;
  width: 100%;
}
.content img {
  width: 90%;
  background-size: contain;
}
</style>