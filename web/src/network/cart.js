import {request,requestPost} from "@/network/request";
import qs from "qs";

//导出获取用户购物车商品数据函数
export function getUserCartData (user_id) {
    return requestPost({
        url:'/home/api/cart',
        data:qs.stringify({
            user_id
        })
    })
}

//导出获取公开的推荐商品数据函数
export function getCommonRecommend () {
    return request({
        url:'/commonRecommend'
    })
}

//导出获取用户推荐商品数据函数
export function getUserRecommend (user_id) {
    return requestPost({
        url:'home/api/userRecommend',
        data:qs.stringify({
           user_id
        })
    })
}

//导出更新用户对应商品状态函数
export function updateChecked (user_id,targets) {
    return requestPost({
        url:'home/api/updateChecked',
        data:{
            user_id,
            targets
        }
    })
}

//导出更新用户对应商品数量函数
export function updateProductCount (user_id,product_id,count,size) {
    return requestPost({
        url:'home/api/updateProductCount',
        data:qs.stringify({
            user_id,
            product_id,
            count,
            size
        })
    })
}

//导出更新用户商品尺码函数
export function updateProductSize(user_id,product_id,origin_size,size){
    return requestPost({
        url:'home/api/updateProductSize',
        data:{
            user_id,
            product_id,
            origin_size,
            size
        }
    })
}

//导出将商品移入对应用户收藏夹函数
export function moveToCollection (user_id,targets) {
    return requestPost({
        url:'home/api/moveToCollection',
        data:qs.stringify({
            user_id,
            targets
        })
    })
}

//导出从用户购物车中删除对应商品函数
export function remove (user_id,targets) {
    return requestPost({
        url:'home/api/remove',
        data:qs.stringify({
            user_id,
            targets
        })
    })
}

//导出提交订单函数
export function submitOrder (user_id,order,total_num,total_price) {
    return requestPost({
        url:'home/api/submitOrder',
        data:({
            user_id,
            order,
            total_num,
            total_price
        })
    })
}

//导出或用户订单信息函数
export function getUserOrderInfo( user_id,order_id){
    return requestPost({
        url:'home/api/orderInfo',
        data:{
            user_id,
            order_id
        }
    })
}

//导出发起支付宝支付请求函数
export function alipayRequest(order){
    return requestPost({
        url:'/alipay',
        data:{
            order
        }
    })
}
export function confirmReceiveOrder(user_id,order_id){
    return requestPost({
        url:'home/api/confirmReceiveOrder',
        data:{
            user_id,
            order_id
        }
    })
}

export function updateOrderStatus(user_id,order_id,status){
    return requestPost({
        url:'home/api/updateOrderStatus',
        data:{
            user_id,
            order_id,
            status
        }
    })
}

//导出获取用户待评价商品函数
export function getUserWaitCommentsOrder(user_id){
    return requestPost({
        url:'home/api/waitComments',
        data:{
            user_id
        }
    })
}

//导出提交用户评价函数
export function submitComments(userInfo,starsNum,reasons,comments,order_id){
    return requestPost({
        url:'home/api/submitComments',
        data:{
            userInfo,
            starsNum,
            reasons,
            comments,
            order_id
        }
    })
}


//导出获取支付宝支付状态函数
export function getAlipayPaymentStatus(out_trade_no,trade_no){
    return requestPost({
        url:'/paymentStatus',
        data:qs.stringify({
            out_trade_no,
            trade_no
        })
    })
}