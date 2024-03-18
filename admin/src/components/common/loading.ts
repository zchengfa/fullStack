import SelfLoading from "./Loading.vue";
import {createApp} from "vue";

export default {
  install(app:any){
    const loadingApp = createApp(SelfLoading)

    const loadingEl = loadingApp.mount(document.createElement('div'))

    document.body.appendChild(loadingEl.$el)

    app.config.globalProperties.$loading = {
      showLoading(){
        //@ts-ignore
        loadingEl.showLoading()
      },
      hiddeLoading(){
        //@ts-ignore
        loadingEl.hiddeLoading()
      }

    }
  }
}