const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const collectionSchema = new schema({
    type:String,
    page:Number,
    product_id:String,
    title:String,
    imagePath:String,
    price:String,
    favorite:String
})

const goodsModel = mongoose.model('shopData', collectionSchema)

module.exports = goodsModel
