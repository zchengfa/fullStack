module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server,{
        cors:{
            origin:'*'
        }
    })

    const {messageModel} = require('../model/model')

    let users = {}
    io.on('connection', socket => {
        socket.on('online',user => {
            users[user] = socket.id
            socket.name = user
            console.log(user + '上线了',socket.id,13)
        })

        socket.on('sendMsg',(message,sender,receiver,sendTime,avatar) => {
            console.log(message,sender,receiver,sendTime,avatar)
            if (users[receiver]){
                socket.to(users[receiver]).emit('receiveMessage',message,sender,sendTime,avatar)
            }
            //对方不在线，将消息存储到mongoDB中
            else {
                let messageObj = {
                    'message':message,
                    'sender':sender,
                    'sendTime':sendTime,
                    'avatar':avatar,
                    'receiver':receiver
                }
                messageModel.insertMany(messageObj,{rawResult:true}).then(res =>{
                    console.log(res)
                })
            }
        })
        socket.on('disconnecting',() => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
                console.log(socket.name+'离线了',20)
                console.log(users,21,socket.name)
            }

        })
    })

}