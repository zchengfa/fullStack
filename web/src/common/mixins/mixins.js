/*
* 这是一个vue的混入文件mixins.js
* 当页面需求一致，所写的代码一致时可以使用混入，这样可以减少代码重复度
* 使用：在需要使用混合的文件中使用mixins属性
* 例如：
*   //先引入混合文件mixins.js
*   import mixins from "@/mixins/mixins"
*
*   //再将mixins添加到mixins属性中去
*   export default {
*       mixins:[mixins]
*   }
*/

//创建回到顶部的混入对象
const backTopMixins = {
  data(){
    return {
      isShowBackTop:false,
      isTabFixed:false,
    }
  },
  methods:{
    contentScroll(position){
      //根据position位置来控制backTop组件的显示或隐藏(position时负数，需先转成正数再做比较)
      this.isShowBackTop = (- position.y)>1000

      //根据position的位置控制tabControl是否吸顶
      this.isTabFixed = (- position.y) > (this.tabOffsetTop - 48)

      this.$store.dispatch('savePosition',JSON.parse(JSON.stringify(position))).then()
    },
    backTop(){
      //回到顶部
      this.$refs.scroll.scrollTo(0,0,300)
    }
  }
}


//创建关闭当前页面的混入对象
const closeCurrentPageMixins = {
  data() {
    return {
      account:'',
      password:'',
      isClose:true,
      isAble:true
    }
  },
  components:{
    Close: () => import('@/components/content/close/Close')
  },
  methods: {
    closeCurrentPage() {
      //点击关闭页面按钮，关闭当前页面，前往profile页面
      this.isClose = false
      this.$router.go(-1)
    }
  },
  activated() {
    this.isClose = true
  }
}

//返回上一页
const backPreviousPageMixins = {
  methods:{
    goBack(){
      this.$router.back()
    }
  }
}

//联系客服
const {getCusInfo} = require("@/network/home") ;
const contactCustomerMixins ={
  data(){
    return{
      token:null,
      customer:null
    }
  },
  methods:{
    //获取客服信息
    getCustomerInfo(){
      getCusInfo().then(res=>{
        res.data['customer_info']?this.customer=res.data['customer_info']:null
      }).catch(err=>{
        console.log(err)
      })
    },
    contactCustomer() {
      //点击联系客服按钮进入用户与客服的聊天界面
      //通过token判断用户是否登录，若已登录进入customer页面
      if (this.token) {
        //已经登录，再判断登录者是否是客服，若是客服登录的，就不允许进入与客服聊天界面，引导登录者去专门的客服专用页面
        if (!this.customer){
          this.$toast.showToast('未查询到任何客服信息，请开发者完善客服信息')
        }
        if (this.$store.state.userInfo.identity!==1000){
          if (this.customer.username){
            this.$router.push({path:'/customer'+'/'+this.customer.username}).then()
          }
          else {
            this.$router.push({path:'/customer'+'/'+this.customer.account}).then()
          }
        }
        else {
          this.$router.push({path:'/chatForCustomer'}).then()
        }
      }
      //未登录，进入登录页面
      else {
        this.$router.push('/login').then()
      }
    }
  },
  created() {
    this.token = this.$store.state.token
    this.token?this.getCustomerInfo():null
  },
  activated() {
    this.token = this.$store.state.token
    this.token?this.getCustomerInfo():null
  }
}

//防抖刷新
const {debounce} = require('@/common/utils')
const refreshScrollMixins = {
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    this.$bus.$on('itemImageLoad',() => {
      refresh()
    })
  }
}

//获取推荐数据
const {getCommonRecommend,getUserRecommend} = require("@/network/cart")
const recommendMixins = {
  mixins:[refreshScrollMixins],
  data(){
    return {
      recommendData:[],
      user_id:null,
      isLogin:null
    }
  },
  methods:{
    //获取商品推荐数据函数
    getCommonRecommend(){
      getCommonRecommend().then(res => {
        this.recommendData = res.data.commonRecommend
      }).catch(err => {
        console.log(err)
      })
    },
    getUserRecommend(token){
      getUserRecommend(token).then(res => {
        if(!res.data.err_code){
          this.recommendData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}

//创建确认收货混入对象
const {confirmReceiveOrder,updateOrderStatus} = require ("@/network/cart");
const confirmReceiveMixins = {
  data(){
    return{
      isReceive:false,
      order_id:'',
      user_id:'',
    }
  },
  methods:{
    confirmReceive(){
      this.isReceive = true
    },
    receiveNone(){
      this.isReceive = false
    },
    receiveHad(){
      console.log('had')
      confirmReceiveOrder(this.user_id,this.order_id).then(res=>{
        if (res){
          updateOrderStatus(this.user_id,this.order_id,3).then(result=>{
            result.status?this.payment_status = 3:null
            this.isReceive = false
            this.$toast.showToast('确认收货成功',3000,'收货提示:')

            this.$nextTick(()=>{
              this.$refs.scroll.scroll.refresh()
            })
          })
        }
      })
    }
  }
}

module.exports = {
  backTopMixins,
  closeCurrentPageMixins,
  backPreviousPageMixins,
  contactCustomerMixins,
  refreshScrollMixins,
  recommendMixins,
  confirmReceiveMixins
}