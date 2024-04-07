```markdown
|-- server
    |-- .gitignore
    |-- app.js
    |-- package-lock.json
    |-- package.json
    |-- model [mongoDB的model文件夹]
    |   |-- categoryDetailModel.js
    |   |-- categoryListModel.js
    |   |-- goodsDataModel.js
    |   |-- goodsDetailModel.js
    |   |-- model.js
    |   |-- multiDataModel.js
    |   |-- termsServiceModel.js
    |-- plugins [数据库连接、支付宝支付相关文件夹]
    |   |-- alipay.js
    |   |-- connectMysql.js
    |   |-- db.js
    |   |-- mysql_query.js
    |-- router [请求的接口文件夹]
    |   |-- admin [后台管理接口]
    |   |   |-- bannerManage.js
    |   |   |-- grounding.js
    |   |   |-- loginAdministrator.js
    |   |   |-- memberManage.js
    |   |   |-- orderManage.js
    |   |   |-- preferential.js
    |   |   |-- seckill.js
    |   |   |-- shopManage.js
    |   |   |-- statistics.js
    |   |-- alipay [web支付接口文件夹]
    |   |   |-- pay.js
    |   |-- cart [web购物车接口文件夹]
    |   |   |-- cart.js
    |   |-- category [web分类接口文件夹]
    |   |   |-- category.js
    |   |-- home [web首页接口文件夹]
    |   |   |-- addShopToCart.js
    |   |   |-- customer.js
    |   |   |-- detail.js
    |   |   |-- goodsData.js
    |   |   |-- multiData.js
    |   |-- homeContent [web首页内容相关接口文件夹]
    |   |   |-- bannerDetail.js
    |   |   |-- search.js
    |   |-- login [web登录接口文件夹]
    |   |   |-- login.js
    |   |-- order [web订单接口文件夹]
    |   |   |-- order.js
    |   |-- profile [web我的接口文件夹]
    |   |   |-- profile.js
    |   |-- register [web注册接口文件夹]
    |       |-- register.js
    |-- socket [socket]
    |   |-- socket.js
    |-- util [工具相关接口文件夹]
        |-- arrayOperation.js
        |-- createProductID.js
        |-- generateID.js
        |-- mailConfig.js
        |-- sendMailer.js
        |-- timeFormatting.js
        |-- token.js
        |-- verifyCode.js

```