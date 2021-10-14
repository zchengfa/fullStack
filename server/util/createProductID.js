const letterString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function createProductId () {
    //分割字符串并返回一个数组
    const letterArray = letterString.split('')

    //获取当前时间
    const currentTime = new Date()

    //获取当前时间的毫秒数
    const currentMillSeconds = currentTime.getTime()

    let randomString = ''

    //创建循环，随机生成一个与letterArray长度一致字符串
    for (let i = 0; i<=letterArray.length; i++) {
        const randomNumber = parseInt((Math.random()*letterArray.length).toString())

        randomString += letterArray[randomNumber]
    }

    //将生存的字符串随机截取。生成一个新字符串
    const  location = parseInt((Math.random()*letterArray.length).toString())
    const newRandom = randomString.substr(location,5)

    //返回最终字符串
    return currentMillSeconds + newRandom

}

module.exports = createProductId
