import {request,requestPost} from "@/network/request";
import qs from "qs";

export function getUserCartData (token) {
    return requestPost({
        url:'/home/api/cart',
        data:qs.stringify({
            token
        })
    })
}

export function getCommonRecommend () {
    return request({
        url:'/commonRecommend'
    })
}

export function getUserRecommend (token) {
    return requestPost({
        url:'home/api/userRecommend',
        data:qs.stringify({
           token
        })
    })
}

export function updateChecked (user_id,product_id,status) {
    return requestPost({
        url:'home/api/updateChecked',
        data:qs.stringify({
            user_id,
            product_id,
            status
        })
    })
}

export function updateProductCount (user_id,product_id,count) {
    return requestPost({
        url:'home/api/updateProductCount',
        data:qs.stringify({
            user_id,
            product_id,
            count
        })
    })
}