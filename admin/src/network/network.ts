import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {URL,debounce} from "../common/utils";
import router from "../router";
import {userStore} from '../pinia/pinia'

const store = userStore()

let baseURL = URL + '/admin'
let timeout = 5000
let requestNum = 0

const hideLoadingDebounce = debounce(() => {
    if(store.isLoading){
        store.changeLoadingStatus(false)
    }
})

function hideLoading (){
    requestNum--
    if(requestNum <= 0){
        if(store.isLoading){
            store.changeLoadingStatus(false)
        }
        hideLoadingDebounce()
    }
}

export function Get(config:Object){
    const instance = axios.create({
        baseURL,
        timeout
    })

    axiosInterceptors(instance)

    return instance(config)
}

export function Post (config:Object){
    const instance = axios.create({
        baseURL,
        method:"post",
        timeout
    })

   axiosInterceptors(instance)

    return instance(config)
}

export function Delete (config:Object){
    const instance = axios.create({
        baseURL,
        method:"delete",
        timeout
    })

    axiosInterceptors(instance)

    return instance(config)
}

function axiosInterceptors(instance:any){
    //axios请求拦截器
    instance.interceptors.request.use(function (config:AxiosRequestConfig){
        if (sessionStorage.getItem('token')){
            config.headers.authorization = sessionStorage.getItem('token')
        }
        if(!store.isLoading && config.headers?.showLoading != false){
            store.changeLoadingStatus(true)
            requestNum ++
        }
        return config
    }, (err:any) =>{
        hideLoading();
        return Promise.reject(err)
    })

    //axios响应拦截器
    instance.interceptors.response.use((response:AxiosResponse) =>{
        if (response.data.err === 401){
            router.push('/login').then()
        }

        hideLoading()
        return response
    }, (err:any) => {
        hideLoading()
        return Promise.reject(err)
    })
}

