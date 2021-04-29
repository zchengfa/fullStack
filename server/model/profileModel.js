const mongoose = require('../plugins/db')

const schema = mongoose.Schema

const profileSchema = new schema({
    type:String,
    list:Array
})

const profileModel = mongoose.model('profileData',profileSchema)

module.exports = profileModel