//引入request方法
import {request, requestPost} from "@/network/request";
import qs from 'qs'

//导出获取首页数据函数
export function getHomeMultiData(){
  return request({
    url:'/multiData'
  })
}

//导出首页获取秒杀数据函数
export function getFlashSaleData(flashSaleTime,num){
  return request({
    url:'/flashSale',
    params:{
      flashSaleTime,
      num
    }
  })
}

//导出获取商品数据函数
export function getGoodsData(user_id,type, page){
  return request({
    url:'/goodsData',
    params:{
      user_id,
      type,
      page
    }
  })
}

//导出获取商品详情数据函数
export function getGoodsDetail(product_type,sell_type,product_id,user_id){
  return request({
    url:'/detail',
    params:{
      product_type,
      sell_type,
      product_id,
      user_id
    }
  })
}

//导出获取该用户是否收藏该产品的状态的函数
export function getProductCollectionStatus(user_id,product_id){
  return request({
    url:'/userProductCollectionStatus',
    params:{
      user_id,
      product_id
    }
  })
}

//导出获取用户选择商品的尺码函数
export function getUserChoseSize(user_id,product_id,id){
  return request({
    url:'/userChoseSize',
    params:{
      user_id,
      product_id,
      id
    }
  })
}

//导出获取用户所有收藏商品的商品ID函数
export function getUserCollectionProductId(user_id){
  return request({
    url:'/userCollectionProductId',
    params:{
      user_id
    }
  })
}

//导出修改对应用户对应商品的收藏状态函数
export function changeUserProductCollectionStatus (user_id,product_id,currentStatus) {
  return request({
    url:'/changeUserProductCollectionStatus',
    params:{
      user_id,
      product_id,
      currentStatus
    }
  })
}

//导出登录函数
export function login (account, pwd) {
  return requestPost({
    url:'/login',
    data:qs.stringify({
      account,
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
export function register (account,pwd,verifyCode) {
  return requestPost({
    url:'/register',
    data:qs.stringify({
      account,
      pwd,
      verifyCode
    })
  })
}

//导出获取服务条款数据函数
export function getTermsServiceData(){
  return requestPost({
    url:'/termsService'
  })
}

//导出商品详情页添加商品到购物车函数
export function addShopToCart (user_id,product) {
  return requestPost({
    url:'/addShopToCart',
    data:{
      user_id,
      product
    }
  })
}

//导出获取客服信息函数
export function getCusInfo(){
  return requestPost({
    url:'/customerInfo',
  })
}

//导出获取用户所有订单信息函数
export function getUserAllOrder(user_id){
  return requestPost({
    url:'home/api/userAllOrder',
    data:{
      user_id
    }
  })
}

//导出用户订单函数
export function removeUserOrder(user_id,order_id){
  return requestPost({
    url:'home/api/removeUserOrder',
    data:{
      user_id,
      order_id
    }
  })
}
