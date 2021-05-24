const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function generateVerifyCode() {
    const stringArr = string.split('')

    let randomString = ''
    //创建循环，随机生成一个与letterArray长度一致字符串
    for (let i = 0; i<=5; i++) {
        const randomNumber = parseInt((Math.random()*stringArr.length).toString())

        randomString += stringArr[randomNumber]
    }
    return randomString
}

module.exports = {
    generateVerifyCode
}