module.exports = ({app,server,port})=>{

//导入请求拦截模块
    require('../util/requestInterceptor')(app)

    require('../socket/socket')(server)

//导入home路由模块
    require('../router/home/multiData')(app)
    require('../router/home/goodsData')(app)
    require('../router/home/detail')(app)
    require('../router/home/addShopToCart')(app)

//导入category路由模块
    require('../router/category/category')(app)

//导入购物车cart路由模块
    require('../router/cart/cart')(app)

//导入profile路由模块
    require('../router/profile/profile')(app)

//导入login登录模块
    require('../router/login/login')(app)

//导入register注册模块
    require('../router/register/register')(app)

//导入管理员登录模块
    require('../router/admin/loginAdministrator')(app)

//导入文件上传模块
    require('../router/admin/uploadFile')(app,port)

//导入商品管理模块
    require('../router/admin/shopManage')(app)

//导入用户管理模块
    require('../router/admin/memberManage')(app)

//导入轮播图管理模块
    require('../router/admin/bannerManage')(app)

//导入商品上下架管理模块
    require('../router/admin/grounding')(app)

//导入秒杀管理模块
    require('../router/admin/seckill')(app)

//导入订单管理模块
    require('../router/admin/orderManage')(app)

//导入数据统计模块
    require('../router/admin/statistics')(app)

//导入优惠券管理模块
    require('../router/admin/preferential')(app)

//导入首页内容详情模块
    require('../router/homeContent/bannerDetail')(app)

//导入搜索模块
    require('../router/homeContent/search')(app)

//导入客服模块
    require('../router/home/customer')(app)

//导入支付宝支付模块
    require('../router/alipay/pay')(app)

//导入订单模块
    require('../router/order/order')(app)

//导入提交商品数据模块
    require('../router/admin/submitTest')(app)
}
