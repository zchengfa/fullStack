//导入mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mall', {useUnifiedTopology:true,useNewUrlParser:true},err => {
    if(err){
        console.log(err)
    }
    else {
        console.log('database connect success（ 数据库连接成功）')
    }
})

module.exports = mongoose
