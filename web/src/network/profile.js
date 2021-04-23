import {request} from "@/network/request";

export function checkLogin (username,pwd) {
    return request({
        url:'/login',
        params:{
            username,
            pwd
        }
    })
}