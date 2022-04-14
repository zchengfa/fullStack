import Vue from 'vue'
import Vuex from 'vuex'
import {
    ADD_CART,
    UPDATE_CART_COUNT,
    SAVE_POSITION,
    USER_INFO,
    SET_TOKEN,
    SAVE_ORDER_ID,
    CHANGE_ORDER_ID,
    SHOW_LOADING,
    HIDE_LOADING
} from "@/store/mutations-types";


Vue.use(Vuex)
//@warning: 将状态管理成员分发给vuex时，存储到sessionStorage中，可以解决页面刷新，状态管理成员的数据清空的问题
const store = new Vuex.Store({
    state:{
        cartList:[],
        position:{},
        order_id:sessionStorage.getItem('trade_no'),
        token:sessionStorage.getItem('token'),
        //将sessionStorage存储的字符串化对象，转换成对象
        userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
        loading:false
    },
    getters:{

    },
    mutations:{
        [USER_INFO](state,userInfo){
            //sessionStorage只能存储字符串，所以需将userInfo对象转换成字符串
            sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
            state.userInfo = userInfo
        },
        [SET_TOKEN](state,token){
            sessionStorage.setItem('token',token)
            state.token = token
        },
        [SAVE_ORDER_ID](state,order_id){
            sessionStorage.setItem('trade_no',order_id)
            state.order_id = order_id
        },
        //已有商品，更新购物车中当前商品的数量
        [UPDATE_CART_COUNT](state,payload){
            //将原先对应数据的数量加上想要添加的数量
            state.cartList[payload.index].shopCount += payload.shopCount
        },
        //添加到购物车
        [ADD_CART](state,payload){
            state.cartList.push(payload)
        },
        [SAVE_POSITION](state,payload) {
            state.position=payload
        },
        [CHANGE_ORDER_ID](state,order_id) {
            sessionStorage.setItem('trade_no',order_id)
            state.order_id=order_id
        },
        [SHOW_LOADING](state){
            state.loading = true
        },
        [HIDE_LOADING](state){
            state.loading = false
        }

    },
    actions:{
        userInfo(context,payload){
            context.commit('userInfo',payload)
        },
        setToken(context,payload){
            context.commit('setToken',payload)
        },
        saveOrderID(context,payload){
            context.commit('saveOrderID',payload)
        },
        addCart(context,payload){
            return new Promise((resolve, reject) => {
                //将商品加入购物车之前先查看state中是否存在当前商品
                let oldProduct = context.state.cartList.find((item,index) => {
                    if(item.product_id === payload.product_id){
                        //当查找到与新添加的数据一致时，给原来商品添加索引，以便之后根据索引改变对应商品的数据
                        item.index = index
                        return item
                    }
                } )

                //若已经存在该商品，提交商品数量更新
                if (oldProduct){
                    //给新商品数据添加索引
                    payload.index = oldProduct.index
                    //向mutations提交事件和新数据
                    context.commit('updateCartCount', payload)
                    resolve('商品已存在，数量已增加+')
                }
                //商品不存在，提交添加到购物车
                else {
                    payload.isChecked = false
                    context.commit('addCart',payload)
                    reject('+添加商品成功')
                }
            })
        },
        savePosition(context,payload) {
            context.commit('savePosition',payload)
        },
        changeOrderId(context,payload){
            //给分发者返回一个Promise，告诉分发者事件已经接收到了
            return new Promise((resolve)=>{
                context.commit('changeOrderId',payload)
                resolve({'operation_code':200})
            })
        },
        showLoading(context){
            return new Promise(resolve => {
                context.commit('showLoading')
                resolve(1)
            })
            //context.commit('showLoading')
        },
        hideLoading(context){
            context.commit('hideLoading')
        }
    }
})

export default store