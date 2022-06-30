//引入axios
import axios from 'axios'
import {URL} from "@/common/utils";
import router from "../router";

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
    if (sessionStorage.getItem('token')){
      config.headers.authorization = sessionStorage.getItem('token')
    }
    return config
  }, (err) =>{
    return Promise.reject(err)
  })

  //axios响应拦截器
  instance.interceptors.response.use((response) =>{
    if (response.data.err === 401){
      router.push('/login').then()
    }

    return response
  }, (err) => {
    return Promise.reject(err)
  })
}
