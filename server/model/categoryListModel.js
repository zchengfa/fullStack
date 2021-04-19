const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const categoryListCollection = new schema({
    type:String,
    categoryList:Array
})

const categoryListModel = mongoose.model('category_list',categoryListCollection)

module.exports = categoryListModel