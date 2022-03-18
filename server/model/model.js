const mongoose = require('../plugins/db')

const schema  = mongoose.Schema

const messageCollections = new schema({
  sender:String,
  receiver:String,
  message:String,
  sendTime:Number,
  avatar:String
})

const messageModel = mongoose.model('message',messageCollections)

module.exports = {
  messageModel
}