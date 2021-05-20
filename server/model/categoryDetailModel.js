const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const categoryDataCollection = new schema({
    type:String,
    categoryDetail:Array
})

const categoryListModel = mongoose.model('categoryDetail',categoryDataCollection)

module.exports = categoryListModel