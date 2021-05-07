import {request,requestPost} from "@/network/request";
import qs from "qs";

export function getUserCartData (token) {
    return requestPost({
        url:'/cart',
        data:qs.stringify({
            token
        })
    })
}

export function getRcommendData () {
    return request({
        url:'/recommend'
    })
}