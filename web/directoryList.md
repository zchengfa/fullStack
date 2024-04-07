```markdown
|-- src
    |-- App.vue
    |-- main.js
    |-- assets [静态资源]
    |   |-- css
    |   |   |-- normalize.css
    |   |   |-- reset.css
    |   |-- emoji
    |   |   |-- emoji.json
    |   |-- image
    |   |   |-- error.png
    |   |   |-- loading.gif
    |   |   |-- none.png
    |   |   |-- base64
    |   |   |   |-- base64.json
    |   |   |-- cart
    |   |   |   |-- balloon.svg
    |   |   |   |-- check.png
    |   |   |   |-- checked.png
    |   |   |   |-- icon_cart.svg
    |   |   |   |-- icon_cart_active.svg
    |   |   |-- category
    |   |   |   |-- camera.svg
    |   |   |   |-- icon_category.svg
    |   |   |   |-- icon_category_active.svg
    |   |   |   |-- message.svg
    |   |   |   |-- scan.svg
    |   |   |   |-- search.svg
    |   |   |-- customer
    |   |   |   |-- emoji.png
    |   |   |   |-- file.png
    |   |   |   |-- location.png
    |   |   |   |-- photo.png
    |   |   |   |-- red_paper.png
    |   |   |   |-- take_photo.png
    |   |   |   |-- video.png
    |   |   |   |-- voice.png
    |   |   |-- delete
    |   |   |   |-- delete.png
    |   |   |-- detail
    |   |   |   |-- arrow_down.png
    |   |   |   |-- arrow_up.png
    |   |   |   |-- back.svg
    |   |   |   |-- cart.png
    |   |   |   |-- customer.png
    |   |   |   |-- favorite.png
    |   |   |   |-- sweetHeart.png
    |   |   |-- empty
    |   |   |   |-- empty.png
    |   |   |-- filterBar
    |   |   |   |-- arrow_filter_down.png
    |   |   |   |-- arrow_filter_normal.png
    |   |   |   |-- arrow_filter_up.png
    |   |   |-- home
    |   |   |   |-- icon_home.svg
    |   |   |   |-- icon_home_active.svg
    |   |   |   |-- backTop
    |   |   |   |   |-- back_to_top.png
    |   |   |   |-- errDetail
    |   |   |       |-- no_data.png
    |   |   |-- login
    |   |   |   |-- avatar.jpg
    |   |   |   |-- login_bg.jpeg
    |   |   |   |-- QQ.svg
    |   |   |   |-- WeChat.svg
    |   |   |-- order
    |   |   |   |-- alipay.png
    |   |   |   |-- location.png
    |   |   |   |-- wechat.png
    |   |   |-- profile
    |   |   |   |-- config.png
    |   |   |   |-- header.png
    |   |   |   |-- header_default.png
    |   |   |   |-- icon_profile.svg
    |   |   |   |-- icon_profile_active.svg
    |   |   |   |-- right.png
    |   |   |-- register
    |   |   |   |-- register_bg.png
    |   |   |-- swiper
    |   |       |-- next.png
    |   |       |-- previous.png
    |   |-- JSON
    |       |-- data.js
    |       |-- data.json
    |-- common [通用代码]
    |   |-- cookie.js
    |   |-- crypt.js
    |   |-- utils.js
    |   |-- mixins
    |       |-- mixins.js
    |-- components
    |   |-- common [公用组件]
    |   |   |-- bubble
    |   |   |   |-- Bubble.vue
    |   |   |-- empty
    |   |   |   |-- Empty.vue
    |   |   |-- loading
    |   |   |   |-- Loading.vue
    |   |   |-- navbar
    |   |   |   |-- NavBar.vue
    |   |   |-- scroll
    |   |   |   |-- Scroll.vue
    |   |   |-- swiper
    |   |   |   |-- Swiper.vue
    |   |   |   |-- SwiperItem.vue
    |   |   |-- tabbar
    |   |   |   |-- TabBar.vue
    |   |   |   |-- TabBarItem.vue
    |   |   |-- toast
    |   |   |   |-- index.js
    |   |   |   |-- Toast.vue
    |   |   |-- trademark
    |   |       |-- Trademark.vue
    |   |-- content [内容性组件]
    |       |-- backTop
    |       |   |-- BackTop.vue
    |       |-- changeSize
    |       |   |-- ChangeSize.vue
    |       |-- close
    |       |   |-- Close.vue
    |       |-- colorMenu
    |       |   |-- ColorMenu.vue
    |       |-- commentStars
    |       |   |-- CommentStars.vue
    |       |-- count
    |       |   |-- Count.vue
    |       |-- customer
    |       |   |-- ChatBar.vue
    |       |   |-- ChatOther.vue
    |       |   |-- Customer.vue
    |       |   |-- Emoji.vue
    |       |-- filterBar
    |       |   |-- FilterBar.vue
    |       |-- flashSale
    |       |   |-- FlashSale.vue
    |       |-- goodsData
    |       |   |-- GoodsData.vue
    |       |   |-- GoodsDataItem.vue
    |       |-- hotVideo
    |       |   |-- HotVideo.vue
    |       |-- login
    |       |   |-- Login.vue
    |       |-- mainTabBar
    |       |   |-- MainTabBar.vue
    |       |-- meansMenu
    |       |   |-- MeansMenu.vue
    |       |-- menuList
    |       |   |-- MenuList.vue
    |       |-- NoneData
    |       |   |-- NoneData.vue
    |       |-- order
    |       |   |-- ConfirmOrder.vue
    |       |-- orderMenu
    |       |   |-- OrderMenu.vue
    |       |-- recommend
    |       |   |-- Recommend.vue
    |       |-- region
    |       |   |-- Region.vue
    |       |-- register
    |       |   |-- Register.vue
    |       |   |-- RegistrationAgreement.vue
    |       |   |-- TermsService.vue
    |       |-- search
    |       |   |-- Search.vue
    |       |-- tabControl
    |           |-- TabControl.vue
    |-- network [请求]
    |   |-- cart.js
    |   |-- category.js
    |   |-- customer.js
    |   |-- home.js
    |   |-- homeContent.js
    |   |-- profile.js
    |   |-- request.js
    |-- router [路由]
    |   |-- index.js
    |-- socket [socket]
    |   |-- socket.js
    |-- store [状态管理]
    |   |-- index.js
    |   |-- mutations-types.js
    |-- views
        |-- cart [购物车]
        |   |-- Cart.vue
        |   |-- components
        |       |-- CheckButton.vue
        |       |-- SettleCart.vue
        |-- category [分类]
        |   |-- Category.vue
        |   |-- components
        |       |-- CategoryListDetail.vue
        |-- chatForCustomer [客服聊天]
        |   |-- chatForCustomer.vue
        |-- detail [详情]
        |   |-- Detail.vue
        |   |-- component
        |       |-- bottom
        |       |   |-- DetailAddCart.vue
        |       |   |-- DetailBottomBar.vue
        |       |-- content
        |       |   |-- DetailBase.vue
        |       |   |-- DetailComment.vue
        |       |   |-- DetailEmpty.vue
        |       |   |-- DetailImage.vue
        |       |   |-- DetailParams.vue
        |       |   |-- ProductSize.vue
        |       |-- navBar
        |           |-- DetailNavBar.vue
        |-- home [首页]
        |   |-- Home.vue
        |-- homeContent [首页内容]
        |   |-- BannerDetail.vue
        |   |-- Comments.vue
        |   |-- SearchProduct.vue
        |   |-- WaitComments.vue
        |-- order [订单]
        |   |-- Order.vue
        |   |-- OrderStatus.vue
        |   |-- PaymentStatus.vue
        |-- profile [我的]
            |-- Profile.vue
            |-- components
                |-- AddAddress.vue
                |-- Avatar.vue
                |-- ManageAddress.vue
                |-- ProductCollection.vue
                |-- User.vue

```