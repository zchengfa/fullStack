import { defineStore } from "pinia";
export const userStore = defineStore('user',{
    state:()=>{
        return {
            token:<string>sessionStorage.getItem('token'),
            rights:<any[]>JSON.parse(<string>sessionStorage.getItem('rights')),
            userInfo:<object>JSON.parse(<string>sessionStorage.getItem('userInfo'))
        }
    },
    actions:{
        setToken(t:string){
            this.token = t
            sessionStorage.setItem('token',t)
        },
        setRights(r:string){
            this.rights = JSON.parse(r)
            sessionStorage.setItem('rights',r)
        },
        setUserInfo(i:string){
            this.userInfo = JSON.parse(i)
            sessionStorage.setItem('userInfo',i)
        },
        addRoutes(f:Function){
            f()

        }
    }
})