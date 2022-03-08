import {requestPost} from "@/network/request";
import qs from 'qs'

export function getUserInfo (user_id) {
    return requestPost({
        url:'/userInfo',
        data:qs.stringify({
            user_id
        })
    })
}

export function addAddress(info){
    return requestPost({
        url:'/addAddress',
        data:{
            info
        }
    })
}

export function getUserAddress(user_id,isDefault){
    return requestPost({
        url:'/getUserAddress',
        data:{
            user_id,
            isDefault
        }
    })
}
