import {request} from "@/network/request";

export function getCategoryList () {
    return request({
        url:'/category_list'
    })
}