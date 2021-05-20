const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const categoryDataCollection = new schema({
    type:String,
    list:Array
})

const categoryListModel = mongoose.model('categoryList',categoryDataCollection)

module.exports = categoryListModel