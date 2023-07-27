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
        setRights(r:any[]){
            this.rights = r
            sessionStorage.setItem('rights',JSON.stringify(r))
        },
        setUserInfo(i:object){
            this.userInfo = i
            sessionStorage.setItem('rights',JSON.stringify(i))
        }
    }
})