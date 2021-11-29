import Vue from 'vue'
import Vuex from 'vuex'
import {ADD_CART, UPDATE_CART_COUNT, SAVE_POSITION, USER_INFO, SET_TOKEN} from "@/store/mutations-types";


Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        cartList:[],
        position:[],
        token:'',
        userInfo:{}
    },
    mutations:{
        [USER_INFO](state,payload){
            state.userInfo = payload
        },
        [SET_TOKEN](state,payload){
            state.token = payload
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
            state.position.push(payload)
        }

    },
    actions:{
        userInfo(context,payload){
            context.commit('userInfo',payload)
        },
        setToken(context,payload){
            context.commit('setToken',payload)
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
        }
    }
})

export default store