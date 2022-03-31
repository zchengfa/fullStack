<template>
	<div class="search-product">
		<div class="nav">
			<div class="left" @click="back"><img src="~assets/image/swiper/previous.png" alt="back"></div>
			<div class="input-box">
				<input class="input-word" type="text" v-model="word" :placeholder="$route.params.word">
			</div>
			<div class=right>
				<button @click="searchGoods">搜索</button>
			</div>
		</div>
    <div class="content">
      <div class="search-history" v-show="word_history.length">
        <div class="title clearfix">
          <h4>搜索历史</h4>
          <div @click="changeShow" v-show="isShowDelete" class="delete-history"><img  src="~assets/image/delete/delete.png"></div>
          <div  v-show="!isShowDelete" class="delete-history">
            <button @click="removeAll" class="delete-all">全部删除</button>
            <button @click="changeShow" class="complete">完成</button>
          </div>
        </div>
        <div class="search-history-box">
          <div v-for="(item,index) in word_history" :key="index">
            <span>{{item}}</span>
            <span v-show="!isShowDelete">x</span>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
	export default {
		name:"SearchProduct",
		data(){
			return {
				word:'',
        word_history:[],
        isShowDelete:true
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
      searchGoods(){
			  //当输入框没有内容时，直接将输入框中placeholder的值作为搜索词
			  if (!this.word.length){
          this.word  = this.$route.params.word
        }
			  //如果数组中没有该搜索词就可以在书中首位放入搜索词
			  if (this.word_history.indexOf(this.word) === -1){
          this.word_history.unshift(this.word)
        }
      },
      changeShow(){
			  this.isShowDelete = !this.isShowDelete
      },
      removeAll(){
			  this.word_history = []
        this.changeShow()
      }
		},
		mounted() {
			//挂在完成后，输入框进入聚焦状态
			document.getElementsByClassName('input-word').item(0).focus()
		}
	}
</script>

<style scoped>
  .clearfix::after{
    display: block;
    content: '';
    height: 0;
    clear: both;
    visibility: hidden;
  }
	.search-product{
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		z-index: 11;
	}
	.nav{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 2.8rem;
		background-color: #fff;
	}
	.nav div{
		flex: 1;
		text-align: center;
	}
	.nav .left img{
		width: 1rem;
	}
	.nav .input-box{
		flex: 8;
		text-align: left;
	}
	.input-box input{
		width: 100%;
		height: 1.8rem;
		border-radius: .9rem;
		border: 1px solid #e84e11;
		text-indent: .5rem;
	}
	input::-webkit-input-placeholder{
		color: #d6d6d6;
	}
	.nav .right{
		flex: 2;
	}
  .content{
    margin: 0 auto;
    width: 94%;
  }
  .content .title h4{
    float: left;
    padding: 0;
    margin-top: 1rem;
    margin-bottom: 0;
    text-indent: .5rem;
  }
  .content .title .delete-history{
    position: relative;
    display: block;
    float: right;
    top: 1rem;
  }
  .title img{
    width: 1rem;
    height:1rem;
  }
  .search-history-box{
    display: flex;
    justify-items: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .search-history-box div{
    margin-top: .8rem;
    margin-left: .5rem;
    padding: .1rem .6rem .3rem;
    border-radius: .4rem;
    background-color: #ece4e4;
    text-align: center;
  }
  .search-history-box span{
    display: inline-block;
    color: #8a8686;
    font-size: 12px;
  }
  .search-history-box span:last-child{
    margin-left: .3rem;
  }
  .delete-history {
    font-size: 12px;
  }
  .delete-all{
    color: #8a8686;
  }
  .complete{
    color: #fd001e;
  }
  .complete::before{
    display: inline-block;
    margin-right: .8rem;
    content: '|';
    height: 80%;
  }
	
</style>
