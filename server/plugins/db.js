//导入mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/mall', {useUnifiedTopology:true,useNewUrlParser:true},err => {
    if(err){
        console.log(`${err}(mongoDB数据库连接失败，请检查您的数据库是否安装或mongo系统服务是否开启)`)
    }
    else {
        console.log('database connect success（mongo数据库连接成功）')
    }
})

module.exports = mongoose
