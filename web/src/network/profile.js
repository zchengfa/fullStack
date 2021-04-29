import {request} from "@/network/request";

export function getProfileData () {
    return request({
        url:'/profile'
    })
}