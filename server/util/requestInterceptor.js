const {verifyToken} = require("./token");
module.exports = (app)=>{
    //除了白名单内的请求，其他请求都必须先进行token验证，验证通过后才能进行当次请求
    app.use((req, res, next) => {
        console.log(req.url)
        //查询数据库中是否已存储了该ip，若有则不存储，
        let requestQuery = ''
        let category_type = ''
        let product_type = ''
        let product_id = ''
        let sell_type = ''
        let flashSaleTime = ''
        let num = 0
        let keyword = ''
        if (req.url.indexOf('/home/api/goodsData?') >= 0) {
            requestQuery = req.query
        } else if (req.url.indexOf('/home/api/category_detail?') >= 0) {
            category_type = req.query.type
        } else if (req.url.indexOf('/home/api/detail?') >= 0) {
            product_type = req.query.product_type
            product_id = req.query.product_id
            sell_type = req.query.sell_type
        } else if (req.url.indexOf('/home/api/flashSale') >= 0) {
            flashSaleTime = req.query.flashSaleTime
            num = req.query.num
        } else if (req.url.indexOf('/home/api/search') >= 0) {
            keyword = req.query.keyword
        }
        //设置请求地址白名单，只要请求地址是白名单内的都不需要进行token验证
        const urlWhiteList = [
            '/admin/loginAdministrator',
            '/home/api/multiData',
            `/home/api/flashSale?flashSaleTime=${flashSaleTime}&num=${num}`,
            `/home/api/goodsData?user_id=${requestQuery.user_id}&type=${requestQuery.type}&page=${requestQuery.page}`,
            '/login',
            '/verifyMailCode',
            '/home/api/commonRecommend',
            '/home/api/category_list',
            `/home/api/category_detail?type=${encodeURI(category_type)}`,
            `/home/api/detail?product_type=${encodeURI(product_type)}&sell_type=${sell_type}&product_id=${product_id}`,
            '/register',
            '/termsService',
            '/submitDataApi',
            '/homeContent/brand_logo',
            '/homeContent/product',
            '/home/api/cart',
            `/home/api/search?keyword=${encodeURI(keyword)}`,
            '/home/api/hotSearch',
            `/home/api/searchProduct?keyword=${encodeURI(keyword)}`,
            '/refreshToken'
        ]

        if (urlWhiteList.indexOf(req.url) >= 0) {
            next()
            return false
        } else {
            //请求地址不在白名单内，获取请求头中的token
            const token = req.headers.authorization
            if (!token) {
                res.send({err_code: 401, msg: 'token信息错误，不存在！'})
            } else {
                verifyToken(token, (err, decode) => {
                    !decode ? res.send({err_code: 4011, msg: 'token信息错误，已过期！'}) : next()
                })
            }
        }
    })

}
