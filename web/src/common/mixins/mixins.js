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
            isTabFixed:false
        }
    },
    methods:{
        contentScroll(position){
            //根据position位置来控制backTop组件的显示或隐藏(position时负数，需先转成正数再做比较)
            this.isShowBackTop = (- position.y)>1000

            //根据position的位置控制tabControl是否吸顶
            this.isTabFixed = (- position.y) > (this.tabOffsetTop - 48)

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


module.exports = {
    backTopMixins,
    closeCurrentPageMixins,
    backPreviousPageMixins
}