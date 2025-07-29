import { defineStore } from "pinia";
export const userStore = defineStore('user',{
    state:()=>{
        return {
            token:<string>sessionStorage.getItem('token'),
            rights:<any[]>JSON.parse(<string>sessionStorage.getItem('rights')),
            userInfo:<object>JSON.parse(<string>sessionStorage.getItem('userInfo')),
            routesSkewMenu:<Array<{name:string,path:string,type:string}>>[],
            isLoading:false
        }
    },
    actions:{
        changeLoadingStatus(status:boolean){
            this.isLoading = status
        },
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
        setSkewMenu(skew:string){
            let menu:any[] = [] , skewData = JSON.parse(skew) , hadExist = false , existIndex = 0
            this.routesSkewMenu ? menu = this.routesSkewMenu : null

            //判断要加的数据之前是否已存在，若存在，先删除再push
            menu.forEach((item:{name:string,path:string,type:string},index)=>{
                if(item.name === skewData.name){
                    hadExist = true
                    existIndex = index
                }
            })

            if(hadExist){
                //已存在，先删除后push
                menu.splice(existIndex,1)

            }

            menu.push(skewData)
            this.routesSkewMenu = menu

        },
        closeSkewMenu(name:string){
            return new Promise((resolve,reject)=>{
                let menu = this.routesSkewMenu , existIndex = 0
                menu.forEach((item:{name:string,path:string,type:string},index)=>{
                    if(item.name === name){
                        existIndex = index
                    }
                })

                if(existIndex === 0 && menu.length === 1){
                    //若要关闭的是首页并且只剩下首页时,返回msg不让其关闭，反之回到首页
                   name === this.rights[0].children[0]['children_name'] ? reject({msg:'当前已是首页'}) : (()=>{
                       this.routesSkewMenu = []
                       this.setSkewMenu(JSON.stringify({
                           'name':this.rights[0].children[0]['children_name'],
                           'path':this.rights[0].children[0].path,
                           'type':'success'
                       }))
                       reject({path:this.rights[0].children[0].path})
                   })()
                }
                else{
                    menu.splice(existIndex,1)
                    this.routesSkewMenu = menu
                    resolve(this.routesSkewMenu[this.routesSkewMenu.length - 1].path)
                }
            })
        }
    }
})

interface MessageType {
    time:bigint,
    role:string,
    message:string
}

export const shopStore = defineStore('shop',{
    state:()=>{
        return {
            data:<any[]>JSON.parse(<string>sessionStorage.getItem('shop')),
        }
    },
    actions:{
        saveShopData(d:any[]){
            this.data = d
            sessionStorage.setItem('shop',JSON.stringify(d))
        }
    }
})

export const chatAssistantStore = defineStore('chatAssistant',{
    state:()=>{
        return {
            isChatAssistant:<boolean>false,
            isFinish:<boolean> false,
            isShowMask: <boolean>false,
            mainMessageBody:<MessageType[]>[],
            owner:<bigint> JSON.parse(sessionStorage.getItem('userInfo') as string).id,
            allMessage:<any[]>JSON.parse(localStorage.getItem('AI_ASSISTANT_MESSAGE_CACHE') as string) || []
        }
    },
    actions:{
        changeChatAssistant(status:boolean){
            this.isChatAssistant = status;
        },
        changeAnswerStatus(status:boolean){
            this.isFinish = status;
        },
        changeMaskStatus(status:boolean){
            this.isShowMask = status
        },
        alterMainMessageBody(messageBody:MessageType){
            this.mainMessageBody.push(messageBody)
            if(!this.allMessage.length){
                this.allMessage.push({
                    user: this.owner,
                    list: this.mainMessageBody
                })
            }
            else{
                this.allMessage?.map((item:any)=>{
                    if(item.user === this.owner){
                        item.list = this.mainMessageBody
                    }
                })
            }
            //持久化
            localStorage.setItem('AI_ASSISTANT_MESSAGE_CACHE',JSON.stringify(this.allMessage))
        },
        initMessageBody(){
            const cache = JSON.parse(JSON.stringify(this.allMessage))
            cache.forEach((item:any)=>{
                if(item.user === this.owner){
                    this.mainMessageBody = item.list.slice(item.list.length >= 10 ? item.list.length - 10 : 0,item.list.length)
                }
            })
        }
    }
})
