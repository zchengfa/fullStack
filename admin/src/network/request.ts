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

export function addProduct (params:object){
    return Post({
        url:'/addProduct',
        data:params
    })
}

export function deleteProduct (product_id:string){
    return Post({
        url:'/deleteProduct',
        data:{
            product_id
        }
    })
}

export function getAdministratorInfo(token:string | null){
    return Post({
        url:'/administratorInfo',
        data:{
            token
        }
    })
}

export function getMemberManageData(){
    return Get({
        url:'/memberManage'
    })
}

export function deleteUser(user_id:string){
	return Post({
		url:'/deleteUser',
		data:{
			user_id
		}
	})
}