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
export function getCookie (username) {
    //思路：1.检测cookie是否有分号，有分号，则说明有两个及以上的cookie值，需要进行处理在准确返回相应的cookie字段
    //没有分号，只有一条cookie
    const cookie = document.cookie
    if (cookie){
        //没有分号。只有一条cookie
        if (document.cookie.indexOf(';') === -1){
           if (cookie.indexOf(username) >=0){
               let cookieArray = []
               cookieArray = cookie.split('=')
               return cookieArray
           }
        }
        else{
            return cookie
        }
    }
    return document.cookie.indexOf(';')
    // let name = username + '='
    // //将字符串以分号作为分割条件并返回一个数组
    // let cookieArray = document.cookie.split(';')
    //
    // //遍历数组
    // cookieArray.map((value)=> {
    //     //去除空格
    //     let trimString = value.trim()
    //     //查看是否已有与给定name一致的字符串，有则返回对应字符串
    //     if (trimString.indexOf(name)) return trimString.substring(name.length, trimString.length)
    // })
    //
    // //没有匹配的cookie返回空字符串
    // return ''
}
