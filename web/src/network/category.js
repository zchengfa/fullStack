import {request} from "@/network/request";

export function getCategoryList () {
    return request({
        url:'/category_list'
    })
}

export function getCategoryDetail (type) {
    return request({
        url:'/category_detail',
        params:{
            type
        }
    })
}