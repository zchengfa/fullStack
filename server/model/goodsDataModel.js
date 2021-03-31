const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const collectionSchema = new schema({
    type:String,
    page:Number,
    shopData:Array
})

const goodsModel = mongoose.model('shopData', collectionSchema)

module.exports = goodsModel
