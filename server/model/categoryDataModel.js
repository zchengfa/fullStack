const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const categoryDataCollection = new schema({
    type:String,
    list:Array,
    categoryData:Array
})

const categoryDataModel = mongoose.model('categoryData',categoryDataCollection)

module.exports = categoryDataModel