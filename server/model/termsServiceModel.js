const mongoose = require('../plugins/db')

const collectionSchema = mongoose.Schema({
    termsService:Object
})

const collectionModel = mongoose.model('terms_service', collectionSchema)

module.exports = collectionModel