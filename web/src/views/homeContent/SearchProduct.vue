<template>
	<div class="clearfix">
    <div class="search-product">
      <div class="nav">
        <div class="left" @click="back"><img src="~assets/image/swiper/previous.png" alt="back"></div>
        <div class="input-box">
          <input class="input-word" type="text" v-model="word" :placeholder="$route.params.word">
        </div>
        <div class=right>
          <button @click="searchGoods()">搜索</button>
        </div>
      </div>
      <div class="content ">
        <div v-if="searchResult.length" class="search-result">
          <div v-for="(item,index) in searchResult" :key="index" @click="itemClick(item)">
            <div class="image-box"><img :src="item['product_image']" alt="image"></div>
            <div class="product-info">
              <p class="title">{{item['product_title']}}</p>
              <p>￥{{item['price']}}</p>
            </div>
          </div>
        </div>
        <div v-show="!searchResult.length && !isShowEmptyResult">
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
              <div @click="searchGoods(item)" v-for="(item,index) in word_history" :key="index">
                <span>{{item}}</span>
                <span v-show="!isShowDelete" class="delete-icon">x</span>
                <div class="delete-word" v-show="!isShowDelete" @click.stop="deleteItem(index)"></div>
              </div>
            </div>
          </div>
          <div class="hot-search-rank">
            <div class="title clearfix">
              <h4>热搜榜</h4>
            </div>
            <div class="hot-search-box">
              <ul>
                <li  v-for="(item,index) in hotSearchData" :key="index" @click="searchGoods(item['word'])">
                  <i :class="{'rank-one':index===0,'rank-two':index===1,'rank-three':index===2}" class="rank">{{index+1}}</i>
                  <span class="word">{{item['word']}}</span>
                  <div>
                    <label for="hot">人气值</label>
                    <span :class="{'hot-one':index===0,'hot-two':index===1,'hot-three':index===2}" id="hot">{{item['search_count']}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="empty-search-result" v-show="isShowEmptyResult">暂未搜索到您想要的相关商品</div>
      </div>
    </div>
  </div>
</template>

<script>
import {addSearchWord,getHotSearch,searchProduct} from "@/network/homeContent";

export default {
  name:"SearchProduct",
  data(){
    return {
      word:'',
      word_history:[],
      isShowDelete:true,
      hotSearchData:[],
      searchResult:[],
      isShowEmptyResult:false
    }
  },
  methods:{
    initData(){
      if(JSON.parse(localStorage.getItem('keyword_history'))){
        this.word_history = JSON.parse(localStorage.getItem('keyword_history'))
      }
      this.getHotSearchRank()
    },
    back(){
      this.$router.go(-1)
    },
    searchGoods(word){
      if (word){
        this.word = word
      }
      else {
        //当输入框没有内容时，直接将输入框中placeholder的值作为搜索词
        if (!this.word.length){
          this.word  = this.$route.params.word
        }
      }
      //如果数组中没有该搜索词就可以在书中首位放入搜索词
      if (this.word_history.indexOf(this.word) === -1){
        this.word_history.unshift(this.word)
      }
      this.addSearchWord(this.word)
      this.searchProduct(this.word)
      this.saveSearchHistory()
    },
    deleteItem(index){
      //问题：会触发searchGoods事件， 办法：在当前元素中关闭事件冒泡
      this.word_history.splice(index,1)
      this.saveSearchHistory()
      console.log(index)
    },
    saveSearchHistory(){
      localStorage.setItem('keyword_history',JSON.stringify(this.word_history))
    },
    changeShow(){
      this.isShowDelete = !this.isShowDelete
    },
    removeAll(){
      localStorage.removeItem('keyword_history')
      this.word_history = []
      this.changeShow()
    },
    addSearchWord(keyword){
      addSearchWord(keyword).then()
    },
    //通过关键词来搜索商品
    searchProduct(word){
      searchProduct(word).then(res=>{
        res.data.length?this.searchResult = res.data:null
        res.data.length?this.isShowEmptyResult=false:this.isShowEmptyResult=true
      })
    },
    //获取热搜榜数据
    getHotSearchRank(){
      getHotSearch().then(res=>{
        res.data.length?this.hotSearchData.push(...res.data):this.hotSearchData = [
          {
            word:'核酸上门检测',
            search_count:'93133'
          },
          {
            word:'夏季新款防紫外线口罩',
            search_count:'93000'
          },
          {
            word:'迷你电冰箱',
            search_count:'92100'
          },
          {
            word:'苹果13绿色',
            search_count:'91000'
          },
          {
            word:'电脑',
            search_count:'90599'
          },
          {
            word:'好睡眠',
            search_count:'90555'
          },
        ]
      })
    },
    itemClick(item){
      //动态路由传参
      this.$router.push('/detail/'+item.sell_type+'/'+item.product_type +'/'+(item.product_id)+'/'+item.id)
    }
  },
  created() {
    this.initData()
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
		height: 100%;
    max-width: var(--app-max-width);
    min-height: 100vh;
		background-color: #fff;
		z-index: 11;
	}
  .delete-icon{
    padding: 0 4px;
  }
	.nav{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 2.8rem;
    max-width: var(--app-max-width);
		background-color: #fff;
	}
	.nav div{
		flex: 1;
		text-align: center;
	}
	.nav .left img{
		width: 1.6rem;
    mix-blend-mode: difference;
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
    position: relative;
    margin: 0 auto;
    width:94%;
    height: calc(100vh - 44px);
    background-color: #FFFFFF;
    overflow-y: scroll;
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
    position: relative;
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
  div.delete-word{
    position: absolute;
    top:0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  .hot-search-box ul li{
    background-color: #fdfcfd;
  }
  .hot-search-box li{
    position: relative;
    margin-top: 1rem;
  }
  .hot-search-box li .word{
    display: block;
    margin-top: .5rem;
    margin-left: 2rem;
    color: #4d4949;
  }
  .hot-search-box li div{
    margin-top: .5rem;
    margin-left: 2rem;
    color: #8a8686;
    font-size: .9rem;
  }
  .hot-search-box li label{
    margin-right: .5rem;
  }
  .rank{
    display: inline-block;
    position: absolute;
    left: .5rem;
    top:0;
    width: 1rem;
    height: 1rem;
    background-color: #c9c4c5;
    text-align: center;
    text-indent: 0;
    border-bottom-left-radius: .4rem;
    border-top-right-radius: .4rem;
    color: #FFFFFF;
  }
  .rank-one{
    background-color: #fd001e;
  }
  .rank-two{
    background-color: #1e8efc;
  }
  .rank-three{
    background-color: #ecc674;
  }
  .hot-one{
    color: #fd001e;
  }
  .hot-two{
    color:  #1e8efc;
  }
  .hot-three{
    color: #ecc674;
  }
  .search-result img{
    width: 6rem;
    border-radius: .5rem;
  }
  .search-result div{
    display: flex;
    justify-items: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
  }
  .search-result .image-box{
    flex: 1;
  }
  .search-result .product-info{
    display: block;
    flex: 9;
    padding-left: 1rem;
  }
  .search-result .product-info p:last-child{
    color: #fd001e;
  }
  .empty-search-result{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: calc(100vh - 44px);
    background-color: #FFFFFF;
    text-align: center;
    color: #8a8686;
  }
</style>
