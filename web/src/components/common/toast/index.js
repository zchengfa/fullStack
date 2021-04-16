import Toast from "@/components/common/toast/Toast";
const toastObject = {}

toastObject.install = function (Vue) {

    //创建toast组件构造器
    const toastConstructor = Vue.extend(Toast)

    //通过new的方式，根据组件构造器，创建一个组件对象
    const toast = new toastConstructor()

    //将组件对象挂载到div元素上
    toast.$mount(document.createElement('div'))

    //将带有组件对象的div绑定到body中
    document.body.appendChild(toast.$el)

    //将组件对象添加到Vue原型上
    Vue.prototype.$toast = toast
}

export default toastObject