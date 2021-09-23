import axios from 'axios'
import {URL} from "../common/utils";

export function Post (config:Object){
    const instance = axios.create({
        baseURL:URL + '/admin',
        method:"post",
        timeout:5000
    })

    return instance(config)
}