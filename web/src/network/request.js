//引入axios
import axios from 'axios'
import {URL} from "@/common/utils";

//导出request函数
export function request(config) {
  //创建实例
  const instance = axios.create({
    baseURL:`${URL}/home/api`,
    timeout:5000
  })

  //axios请求拦截器
  instance.interceptors.request.use(config =>{
    return config
  }, err =>{
    console.log(err)
  })

  //axios响应拦截器
  instance.interceptors.response.use(config =>{
    return config
  }, err => {
    console.log(err)
  })

  //返回一个axios实例
  return instance(config)
}

export function requestPost (config) {
  const instance = axios.create({
    baseURL:URL,
    timeout:5000,
    method:"POST"
  })

  return instance(config)
}
