import axios from "axios";

export function Post(config:any){
    const instance = axios.create({
        baseURL:'http:'+ '//' + window.location.host.toString().split(':')[0] + ':3000',
        method:'POST',
        timeout:5000
    })
    return instance(config)
}

export function submitData(data:Object){
    return Post({
        url:'/submitDataApi',
        data:{
            data
        }
    })
}