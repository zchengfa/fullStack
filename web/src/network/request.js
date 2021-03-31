//引入axios
import axios from 'axios'

//导出request函数
export function request(config) {
  //创建实例
  const instance = axios.create({
    baseURL:'http://192.168.1.110:3000/home/api',
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
