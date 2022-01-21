import {requestPost} from "@/network/request";

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

