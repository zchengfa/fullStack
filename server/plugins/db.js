//导入mongoose
const mongoose = require('mongoose')
const {currentFileName} = require("../util/util");

try{
    mongoose.connect(process.env.MONGODB_ADDRESS, {useUnifiedTopology:true,useNewUrlParser:true},err => {
        if(err){
            console.log(`${currentFileName(__filename)}(mongoDB数据库连接失败，请检查您的数据库是否安装或mongo系统服务是否开启)${err}`)
        }
        else {
            console.log(`${currentFileName(__filename,true)}database connect success（mongo数据库连接成功）`)
        }
    })
}
catch(err){
    console.log(currentFileName(__filename)+err)
}

module.exports = mongoose
