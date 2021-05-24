//引入request方法
import {request, requestPost} from "@/network/request";
import qs from 'qs'

//导出获取首页数据函数
export function getHomeMultiData(){
  return request({
    url:'/multiData'
  })
}

//导出获取商品数据函数
export function getGoodsData(type, page){
  return request({
    url:'/goodsData',
    params:{
      type,
      page
    }
  })
}

//导出获取商品详情数据函数
export function getGoodsDetail(product_type,product_id){
  return request({
    url:'/detail',
    params:{
      product_type,
      product_id
    }
  })
}

//导出登录函数
export function login (username, pwd) {
  return requestPost({
    url:'/login',
    data:qs.stringify({
      username,
      pwd
    })
  })
}
//导出发送验证码请求函数
export function sendMailVerifyCode (email) {
  return requestPost({
    url:'/verifyMailCode',
    data:qs.stringify({
      email
    })
  })
}

//导出注册函数
export function register (username,pwd) {
  return requestPost({
    url:'/register',
    data:qs.stringify({
      username,
      pwd
    })
  })
}

//导出商品详情页添加商品到购物车函数
export function addShopToCart (token,product_id,title,image,price,count) {
  return requestPost({
    url:'/addShopToCart',
    data:qs.stringify({
      token,
      product_id,
      title,
      image,
      price,
      count
    })
  })
}
