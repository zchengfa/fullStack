//导入mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mall', {useNewUrlParser:true,useUnifiedTopology:true},err => {
    if(err){
        console.log(err)
    }
    else {
        console.log('database connect success')
    }
})

module.exports = mongoose
