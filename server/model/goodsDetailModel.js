const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const collectionSchema = new schema({
    type:String,
    product_id:Number,
    product_detail:Array
})

const goodsDetailModel = mongoose.model('shopDetail', collectionSchema)

module.exports = goodsDetailModel
