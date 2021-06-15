<template>
<div class="emoji">
  <div class="emoji-item" v-for="(item,index) in emoji" :key="index" @click="selectEmoji(index)">{{item}}</div>
</div>
</template>

<script>
import emojis from '@/assets/emoji/emoji.json'
export default {
  name: "Emoji",
  data(){
    return {
      emoji:[]
    }
  },
  methods:{
    selectEmoji(index){
      this.$emit('selectEmoji',this.emoji[index])
    }
  },
  created() {
    this.emoji = emojis
  }
}
</script>

<style scoped>
.emoji{
  text-align: center;
  background-color: #fff;
}
.emoji-item{
  display: inline-block;
  margin: .2rem auto;
  width: 3rem;
  font-size: 1.5rem;
  line-height: 2rem;

}
</style>