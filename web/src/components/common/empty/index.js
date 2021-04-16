import Empty from "@/components/common/empty/Empty";

const emptyObject = {}

emptyObject.install = function (Vue) {
    const emptyConstructor = Vue.extend(Empty)

    const empty = new emptyConstructor()

    empty.$mount(document.createElement('div'))

    document.body.appendChild(empty.$el)

    Vue.prototype.$empty = empty
}

export default emptyObject