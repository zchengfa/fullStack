import {ElMessageBox} from "element-plus";

export const URL:string = import.meta.env.VITE_BASE_URL;

/**
 * @function getPropertyArray 用于获取数组或对象中需要的属性名，将属性名加入到新数组中并返回
 * @description _propertyArray 是一个用于存储属性名的数组
 * @param array 接收一个数组
 */
export function getPropertyArray (array:any){
    let _propertyArray:(keyof typeof array)[] = []
    for (const arrayKey in array) {
        _propertyArray.push(arrayKey)
    }
    return _propertyArray
}

/**
 * 获取当前时间（xxxx年-xx月-xx日）
 * @return { string } 返回年月日字符串
 */
export function getYear(){
    let year = new Date().getFullYear()
    let month = (new Date().getMonth())+1
    let date = new Date().getDate()
    return year+'-'+month+'-'+date
}

/**
 * 获取星期信息
 * @return { string } 返回星期
 */
export function getWeek(){
    let day = new Date().getDay()
    switch (day) {
        case 0:
            return '星期天';
        case 1:
            return '星期一';
        case 2:
            return '星期二';
        case 3:
            return '星期三';
        case 4:
            return '星期四';
        case 5:
            return '星期五';
        case 6:
            return '星期六';
        default:
            return null;
    }
}

/**
 * 实时获取当前时间
 * @param targetTime
 */
export function getTime(targetTime:any){
    setInterval(()=>{
        let hour = new Date().getHours()
        let minutes = new Date().getMinutes().toString()
        let seconds = new Date().getSeconds().toString()
        if (Number(minutes) < 10){
            minutes = '0' + minutes
        }
        if (Number(seconds) < 10){
            seconds = '0' + seconds
        }
        targetTime = hour+':'+minutes+':'+seconds
    },1000)
}

export function createFormRule (propertyArr:any[]){
    let obj:any = {}
    propertyArr.forEach((item:any)=>{
        if(typeof item === 'string'){
            obj[`${item}`] = {
                required:true,
                message:'该项内容不能为空',
                trigger:'blur'
            }
        }
        else{
            obj[`${item.name}`] = {
                required:true,
                message:item.message,
                trigger:'blur'
            }
        }
    })
    return obj
}


 export function tableToExcel(data:any[]){

     ElMessageBox.alert('确定将当前数据导出为Excel文件？','操作确认',{
         cancelButtonText:'取消',
         confirmButtonText:'确认导出',
         callback:(value, action)=>{
             if(value === 'confirm'){
                 //列标题
                 let head = `<tr class="table-header"><td>商品id</td><td>商品标题</td><td>图片</td><td>价格</td><td>库存</td></tr>`;
                 let tbody="";//内容
                 for (let item in data) {
                     tbody+=
                       `<tr class="product">
                                     <td class="id">${data[item]['id'] + '\t'}</td>
                                     <td class="title">${data[item]['title'] + '\t'}</td>
                                     <td class="path">${data[item]['imagePath'] + '\t'}</td>
                                     <td class="price">￥${data[item]['price'] + '\t'}</td>
                                     <td class="stocks">${data[item]['count'] + '\t'}</td>
                                 </tr>`
                 }
                 let str = head+tbody;//头部跟身体内容连接

                 //Worksheet名
                 let worksheet = '商品数据'
                 let uri = 'data:application/vnd.ms-excel;base64,';

                 //下载的表格模板数据(需要设置编码格式utf-8，不设置会在打开Excel文件时会乱码)
                 let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                               xmlns:x="urn:schemas-microsoft-com:office:excel"
                               xmlns="http://www.w3.org/TR/REC-html40" lang="en">
                               <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                                 <x:Name>${worksheet}</x:Name>
                                 <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                                 </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                                 <meta charset="UTF-8">
                                 <style type="text/css">
                                    .table-header td{
                                         padding: 16px;
                                         height: 60px;
                                         text-align: center;
                                         color: #FFFFFF;
                                         background-color: #1e8efc;
                                         border: 1px solid #8a8a8a;
                                    }
                                    .product{
                                         text-align: center;
                                    }
                                    td{
                                         padding: 16px;
                                    }

                                    .id{
                                         color: #1e8efc;
                                    }
                                    .title{
                                         color: #d91868;
                                    }
                                    .path{
                                         color: orchid;
                                         font-weight: bold;
                                    }
                                    .price{
                                         width: 100px;
                                         color: red;
                                    }
                                    .stocks{
                                         width: 100px;

                                    }
                                 </style><title></title>
                                 </head><body><table>${str}</table></body></html>`;
                 //下载模板
                 window.location.href = uri + base64(template)
             }
         }
     })

}
//输出base64编码
export function base64 (s:any) {
    return window.btoa(unescape(encodeURIComponent(s)))
}

export function timeFormatting (time:any,fm:string = 'YYYY-MM-DD hh:mm:ss',){
    //拓展Date的时间格式化函数
    //@ts-ignore
    Date.prototype.format = function (fmt:string){
        let formatObject = {
            "M+": this.getMonth() + 1,                   //月份
            "d+": this.getDate(),                        //日
            "h+": this.getHours(),                       //小时
            "m+": this.getMinutes(),                     //分
            "s+": this.getSeconds(),                     //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()                  //毫秒
        };

        //  获取年份
        // ①
        if (/(y+)/i.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (let k in formatObject) {
            // ②
            if (new RegExp("(" + k + ")", "i").test(fmt)) {
                fmt = fmt.replace(
                    //@ts-ignore
                    RegExp.$1, (RegExp.$1.length === 1) ? (formatObject[k]) : (("00" + formatObject[k]).substr(("" + formatObject[k]).length)));
            }
        }
        return fmt;
    }
    if (time){
        return time.format(fm)
    }
    else {
        //@ts-ignore
        return new Date().format(fm)
    }

}

/**
 * //ts+promise手写ajax
 interface ajaxOption {
    url:string,
    method?:string,
    data:any,
    timeout:number,
    headers?:object,
    async?:boolean
}

 //参数拼接函数
 function appendUrlParams (data:any) {
    let paramsArr:any[] = []

    //遍历data对象
    for (let key in data) {
        //参数加上=号并使用encodeURIComponent对参数中的特殊字符进行转义避免内容丢失造成读取数据失败，最后将其push到新数组中
        // @ts-ignore
        paramsArr.push(`${key}=${encodeURIComponent(paramsArr[key])}`)
    }

    //将数组中的元素转换成字符串后返回
    return paramsArr.join('&')
}

 export function ajax(options:ajaxOption = { url:'', method:'GET', data:{}, timeout:3000, async:true }){
    return new Promise((resolve, reject)=>{

        if (!options.url) throw Error('URL is required!')
        let xhr: XMLHttpRequest;

        //创建ActiveXObject时ts报错，去tsconfig.json文件中启用scripthost库
        window.XMLHttpRequest?xhr = new XMLHttpRequest():xhr=new ActiveXObject("Microsoft.XMLHTTP")

        //参数拼接用于GET请求
        let queryParams = appendUrlParams(options.data)

        //设置请求头
        const headers = options.headers || {"Content-type":"application/json;charset=UTF-8"}
        //Object.keys方法获取对象中的属性名返回一个数组
        Object.keys(headers).forEach(key=>{
            //@ts-ignore
            xhr.setRequestHeader(key,headers[key])
        })

        //超时处理
        xhr.timeout = options.timeout
        xhr.ontimeout = ()=>{
            reject('请求超时！')
        }

        //连接
        //将请求方式参数转换成全大写
        // @ts-ignore
        let method = options.method.toUpperCase()
        if (method === 'GET') {
            xhr.open('get',`${options.url}?${queryParams}`,<boolean>options.async)
            xhr.send()
        }
        else if (method === 'POST') {
            xhr.open('post',options.url,<boolean>options.async)
            xhr.send(options.data)
        }

        //接收
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState === 4) {
                (xhr.status >= 200 && xhr.status <=300 || xhr.status === 304)? resolve(xhr.responseText) : reject(xhr.status)
            }
        }
    })
}

 ajax({
    url:'url',
    method:'get',
    timeout:3000,
    data:{},
    async:true
}).then()
 */

export function debounce (fn:Function, delay:number = 500) {
    let timer:any = null
    return function(...args:any){
        if (timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            //@ts-ignore
           fn.apply(this, args)
        }, delay)
    }
}

export function throttle <T extends any[]>(fn: (...args: T) => void, delay: number) {
    let lastExecTime = 0;
    return (...args: T) => {
        const now = Date.now();
        if (now - lastExecTime >= delay) {
            //@ts-ignore
            fn.apply(this, args);
            lastExecTime = now;
        }
    };
}

//初始化主题
export function initTheme (){
    const theme = localStorage.getItem("theme") as string || 'light';
    document.documentElement.setAttribute('data-theme',theme)
    return theme;
}
