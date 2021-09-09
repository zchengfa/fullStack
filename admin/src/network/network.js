import axios from 'axios'
import {URL} from "../common/utils";

export function Post (config){
    const instance = axios.create({
        baseURL:'/admin',
        method:'POST',
        timeout:5000
    })

    return instance(config)
}