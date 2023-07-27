export const URL:string = 'http:'+ '//' + window.location.host.toString().split(':')[0] + ':3000'


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