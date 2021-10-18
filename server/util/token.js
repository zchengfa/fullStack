const jwt = require('jsonwebtoken')
function createToken (params,privateKey,expiresTime) {


    //生成token,当过期时间number类型时以秒计算
    return jwt.sign(params, privateKey, {expiresIn: expiresTime})
}

function verifyToken (token,callback){
    jwt.verify(token,'administrator',callback)
}

module.exports = {
    createToken,
    verifyToken
}