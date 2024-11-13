<template>
  <div class="image-loader-box" :style="{backgroundColor: bgColor,height: height}">
    <img v-if="status === 'loading'" class="loader-item load-default" src="../../../assets/image/load_default.png"  alt="loading_img"/>
    <img v-else-if="status === 'failed'" src=""  class="loader-item"  alt="load_failed_img"/>
    <img :src="src" class="loader-item load-image" @error="handleError" @load="handleLoad"  alt="load_img"/>
  </div>
</template>

<script>
	export default {
		name:'ImageLoader',
		props:{
			src:{
				type:String,
				default(){
					return ''
				}
			},
			bgColor:{
				type:String,
				default(){
					return '#fff'
				}
			},
      height:{
        type:String,
        default(){
          return 'auto'
        }
      }
		},
		data(){
			return {
				status:'loading'
			}
		},
		methods:{
			handleError(){
				this.status = 'failed'
        this.$emit('load')
			},
			handleLoad(){
				this.status = 'load'
        this.$emit('load')
			}
		}
	}
</script>

<style scoped>
  .image-loader-box{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    border-radius: .5rem;
  }
  .image-loader-box img{
    width: 100%;
    height: 100%;
    border-radius: .5rem;
  }
  .loader-item{
    position: absolute;
  }
  img.load-default{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    animation: rotateLoad 2s infinite linear;
  }
  @keyframes rotateLoad {
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>