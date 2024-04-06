const jwt = require('jsonwebtoken')
let secretOrPrivateKey = process.env.JWT_PRIVATE_KEY
function createToken (params,expiresTime) {


    //生成token,当过期时间number类型时以秒计算
    return jwt.sign(params,secretOrPrivateKey, {expiresIn: expiresTime})
}

function verifyToken (token,callback){
    jwt.verify(token,secretOrPrivateKey,callback)
}

module.exports = {
    createToken,
    verifyToken
}