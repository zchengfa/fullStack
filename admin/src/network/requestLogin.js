import {Post} from "./network";
import qs from 'qs'


export function loginAdministrator (account,password){
    return Post({
        url:'/loginAdministrator',
        data:qs.stringify({
            account,
            password
        })
    })
}