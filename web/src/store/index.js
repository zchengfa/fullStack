import Vue from 'vue'
import Vuex from 'vuex'
import {ADD_CART,UPDATE_CART_COUNT} from "@/store/mutations-types";

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        cartList:[]
    },
    mutations:{
        //已有商品，更新购物车中当前商品的数量
        [UPDATE_CART_COUNT](state,payload){
            console.log(state.cartList)
            state.cartList[payload.index].shopCount += payload.shopCount
        },
        //添加到购物车
        [ADD_CART](state,payload){
            state.cartList.push(payload)
        }
    },
    actions:{
        addCart({state,commit},payload){

            //将商品加入购物车之前先查看state中是否存在当前商品
            // let index = -1
            let oldProduct = state.cartList.find((item,index) => {
                if(item.product_id === payload.product_id){
                    item.index = index
                    return item
                }
            } )

            //若已经存在该商品，提交商品数量更新
            if (oldProduct){
                console.log(oldProduct)
                commit('updateCartCount',oldProduct)
            }
            //商品不存在，提交添加到购物车
            else {
                commit('addCart',payload)
            }
        }
    }
})

export default store