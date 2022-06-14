import Toast from "./Toast.vue";
import { createApp } from "vue";

export default {
    install(app:any){

        //创建应用实例
        const application = createApp(Toast)

        //将实例挂载到div上
        const appEl = application.mount(
            document.createElement('div')
        )

        //将挂载有实例的盒子加入到body中
        document.body.appendChild(appEl.$el)

        //含有方法的对象
        const PUBLIC_FUN = {
            showToast(message:string,duration:number,title:string){
                // @ts-ignore
                appEl.showToast(message,duration,title)
            }
        }

        //将对象挂载为app的全局属性
        app.config.globalProperties.$toast = PUBLIC_FUN
    }
}