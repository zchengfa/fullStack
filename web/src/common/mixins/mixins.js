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

const backPreviousPageMixins = {
    methods:{
        goBack(){
            this.$router.back()
        }
    }
}

const {getCusInfo} = require("@/network/home") ;
const contactCustomerMixins ={
    data(){
        return{
            token:this.$store.state.token,
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
                //this.$store.state.userInfo.identity!==1000?this.$router.push({path:'/customer'+'/'+this.customer.account}):this.$router.push({path:'/chatForCustomer'})
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
        this.token?this.getCustomerInfo():null
    }
}

const {debounce} = require('@/common/utils')
const refreshScrollMixins = {
	mounted() {
		const refresh = debounce(this.$refs.scroll.refresh, 200)
		this.$bus.$on('itemImageLoad',() => {
		  refresh()
		})
	}
}

module.exports = {
    backTopMixins,
    closeCurrentPageMixins,
    backPreviousPageMixins,
    contactCustomerMixins,
		refreshScrollMixins
}