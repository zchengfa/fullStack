import {Post,Get,Delete} from "./network";
// @ts-ignore
import {stringify} from "qs";

//文件删除请求
export function deleteFile(params:any){
    return Delete({
        url:`/deleteFile/${params.uid}/${params.file_video_name}/${params.file_image_name}`,
    })
}

//文件上传请求
export function uploadFile(data:FormData,callback:Function){
    return Post({
        url:'/upload',
        data,
        timeout: 1000000
    })
}

//检查文件完整性
export function checkFileComplete(file_info:{hashArray:string[],file_title:string}){
    return Post({
        url:'/checkFile',
        data:file_info,
    })
}

interface FileInfo {
    uid?:bigint,
    name?: string,
    lastModified?:bigint,
    type?: string,
}

//文件合并请求
export function mergeFile(data:{hash:string,totalChunks: number,file_info:FileInfo}){
    return Post({
        url:'/mergeFile',
        data
    })
}
//获取视频数据
export function getVideo(){
    return Get({
        url:'/getVideos'
    })
}

export function loginAdministrator (account:string,password:string){
    return Post({
        url:'/loginAdministrator',
        data:stringify({
            account,
            password
        })
    })
}

export function getPreferential (){
    return Get({
        url:'/preferential',

    })
}

export function releasePreferential(status:boolean,id:number){
    return Post({
        url:'/releasePreferential',
        data:{
            status,id
        }
    })
}

export function addPreferentialRequest(formData: any){
    return Post({
        url:'/addPreferential',
        data:{
            formData
        }
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
