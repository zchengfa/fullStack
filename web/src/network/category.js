import {request} from "@/network/request";

export function getCategoryData () {
    return request({
        url:'/category_data'
    })
}