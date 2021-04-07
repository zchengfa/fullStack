//引入request方法
import {request} from "@/network/request";

//导出获取首页数据函数
export function getHomeMultiData(){
  return request({
    url:'/multiData'
  })
}
export function getGoodsData(type, page){
  return request({
    url:'/goodsData',
    params:{
      type,
      page
    }
  })
}

export function getGoodsDetail(product_type,product_id){
  return request({
    url:'/detail',
    params:{
      product_type,
      product_id
    }
  })
}
