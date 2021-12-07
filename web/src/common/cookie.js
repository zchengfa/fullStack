//设置cookie
export function setCookie (username, password, expiresTime=1) {
    //获取保存cookie时的时间
    let date = new Date()

    //设置毫秒数
    date.setTime(date.getTime()+(expiresTime *24 *60 *60 *1000))

    //将时间转换成字符串
    let expires = 'expires='+ date.toUTCString()

    //写入cookie
    document.cookie = username + '=' +password + ';' +expires
}
//获取cookie
export function getCookie (account) {
    //思路：1.检测cookie是否有分号，有分号，则说明有两个及以上的cookie值，需要进行处理在准确返回相应的cookie字段
    //没有分号，只有一条cookie
    const cookie = document.cookie
    if (cookie){
        let cookieArray = []
        let itemArray = []
        let cookieObject = {
            account:'',
            password:''
        }
        //没有分号。只有一条cookie
        if (document.cookie.indexOf(';') === -1){
           if (cookie.indexOf(account) >=0){
               cookieArray = cookie.split('=')
               cookieObject.account = cookieArray[0]
               cookieObject.password = cookieArray[1]
               return cookieObject
           }
        }
        //有分号，有两条及以上的cookie
        else{
            cookieArray = cookie.split(';')
            cookieArray.map(item =>{
                //去除空格
                item = item.trim()
                if (item.indexOf(account)>=0){
                    itemArray = item.split('=')
                }
            })
            //返回处理好的cookie
            cookieObject.account = itemArray[0]
            cookieObject.password = itemArray[1]
            return cookieObject
        }
    }
    //没有符合条件的cookie，返回空字符串
    return ''
}
