const mongoose = require('../plugins/db')

const collectionSchema = mongoose.Schema({
    multiData:Array
})

const collectionModel = mongoose.model('multiData', collectionSchema)

module.exports = collectionModel