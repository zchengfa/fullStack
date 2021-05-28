import {requestPost} from "@/network/request";
import qs from 'qs'

export function getUserInfo (username,user_id) {
    return requestPost({
        url:'/userInfo',
        data:qs.stringify({
            username,
            user_id
        })
    })
}