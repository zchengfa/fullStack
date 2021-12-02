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