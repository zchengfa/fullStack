const jwt = require('jsonwebtoken')
const {Promise} = require("mongoose");
let secretOrPrivateKey = process.env.JWT_PRIVATE_KEY
function createToken (params,expiresTime) {


    //生成token,当过期时间number类型时以秒计算
    return jwt.sign(params,secretOrPrivateKey, {expiresIn: expiresTime})
}

function verifyToken (token,callback){
    jwt.verify(token,secretOrPrivateKey,callback)
}

const verifyTokenAsync = (token)=>{
    return new Promise((resolve, reject)=>{
        verifyToken(token,(err,decode)=>{
            if(err){
                reject(err)
            }
            else {
                resolve(decode)
            }
        })
    })
}
module.exports = {
    createToken,
    verifyToken,
    verifyTokenAsync
}
