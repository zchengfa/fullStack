function createToken (params,privateKey,expiresTime) {
    const jwt = require('jsonwebtoken')

    //生成token,当过期时间number类型时以秒计算
    const token = jwt.sign(params,privateKey,{expiresIn: expiresTime})

    return token
}

module.exports = {
    createToken
}