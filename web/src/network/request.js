//引入axios
import axios from 'axios'
import {URL} from "@/common/utils";
import router from "../router";
import store from "../store";
import Vue from "vue";

//导出获取热点视频数据函数
export function getHotVideo(){
  return axios.get('/api/billboard?type=hot_video&key=6045739589f45edbd9ef1c67c581f33a&size=50')
}

//导出request函数
export function request(config) {
  //创建实例
  const instance = axios.create({
    baseURL:`${URL}/home/api`,
    timeout:5000
  })

  axiosInterceptors(instance)
  //返回一个axios实例
  return instance(config)
}

export function requestPost (config) {
  const instance = axios.create({
    baseURL:URL,
    timeout:5000,
    method:"POST"
  })
  axiosInterceptors(instance)

  return instance(config)
}

function axiosInterceptors(instance){
  //axios请求拦截器
  instance.interceptors.request.use(function (config){
    if (store.state.token){
      config.headers.authorization = store.state.token
    }
    return config
  }, (err) =>{
    return Promise.reject(err)
  })

  //axios响应拦截器
  instance.interceptors.response.use((response) =>{
    if (response.data.err_code === 401){
      router.push('/login').then()
    }
    else if(response.data.err_code === 4011){
      requestPost({
        url:'/refreshToken',
        data:{
          refresh_token:localStorage.getItem('Refresh_token'),
          user_id:store.state.userInfo.user_id
        }
      }).then(res=>{
        store.dispatch('setToken',JSON.stringify({
          Access_token:res.data.Access_token,
          Refresh_token:res.data.Refresh_token
        })).then()
      })
    }

    return response
  }, (err) => {
    if (store.state.loading){
      //请求超时，关闭loading组件，并弹出提示框告知用户
      store.dispatch('hideLoading').then(()=>{
        Vue.prototype.$toast.showToast('请检查您的服务器是否出现错误',3000,'请求超时')
      })
    }
    return Promise.reject(err)
  })
}
