import {Post,Get} from "./network";
// @ts-ignore
import {stringify} from "qs";

export function loginAdministrator (account:string,password:string){
    return Post({
        url:'/loginAdministrator',
        data:stringify({
            account,
            password
        })
    })
}

export function getShopManageData(){
    return Get({
        url:'/shopManage'
    })
}