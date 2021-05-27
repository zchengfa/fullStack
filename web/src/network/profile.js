import {requestPost} from "@/network/request";
import qs from 'qs'

export function getUserInfo (username) {
    return requestPost({
        url:'/userInfo',
        data:qs.stringify({
            username
        })
    })
}