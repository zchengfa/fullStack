const ID = function generateUserID () {
    //获取当前时间的毫秒数
    let time = new Date().getTime()

    const letterString ='qwertyuiopasdfghjklzxcvbnm'

    const stringArray = letterString.split('')

    let randomLetter = ''
    for (let i = 0; i < 2; i++) {
        let randomIndex = parseInt((Math.random() * stringArray.length).toString())
        randomLetter += stringArray[randomIndex]
    }


    return time + '_' + randomLetter
}

module.exports = ID