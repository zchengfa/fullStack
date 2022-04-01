import {requestPost,request} from "@/network/request";

export function getBrandLogo(brand_id){
    return requestPost({
        url:'/homeContent/brand_logo',
        data:{
            brand_id
        }
    })
}

export function getProductByID(brand_id){
    return requestPost({
        url:'/homeContent/product',
        data:{
            brand_id
        }
    })
}

//添加搜索词到数据库
export function addSearchWord(keyword){
    return request({
        url:'/search',
        params:{
            keyword
        }
    })
}

//获取热搜榜数据
export function getHotSearch(){
    return request({
        url:'/hotSearch'
    })
}

//通过关键词搜索商品
export function searchProduct(keyword){
    return request({
        url:'/searchProduct',
        params:{
            keyword
        }
    })
}