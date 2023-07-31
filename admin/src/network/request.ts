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

export function alterProduct (product_id:string,alterData:any){
    return Post({
        url:'/alterProduct',
        data:{
					product_id,
          alterData
        }
    })
}

export function getAdministratorInfo(token:string | null ){
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

export function getStatisticsData(){
    return Get({
        url:'/statisticsData'
    })
}
interface operation {
    isShow:boolean,
    id:number
}
export function operateBanner(operation:operation | null){
    return Post({
        url:'/operationBanner',
        data:stringify({
            ...operation
        })
    })
}

export function getBannerData(){
    return Post({
        url:'/banner',
    })
}

export function getOrderData(){
    return Post({
        url:'getOrderData'
    })
}

export function saveFlashTime(data:any){
    return Post({
        url:'/saveFlashTime',
        data:{
            data
        }
    })
}

export function addSeckillRequest(data:string[],time:number){
    return Post({
        url:'/addSeckill',
        data:{
            data,
            time
        }
    })
}

export function removeSeckill(id:string){
    return Post({
        url:'/removeSeckill',
        data:{
            id
        }
    })
}

interface params {
    id:string | string[],
    status:number
}

export function groundProduct(params: params) {
    return Post({
        url:'/groundPro',
        data:{
            params
        }
    })
}