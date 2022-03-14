module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server,{
        cors:{
            origin:'*'
        }
    })

    let users = {}
    io.on('connection', socket => {
        socket.on('online',user => {
            users[user] = socket.id
            socket.name = user
            console.log(user + '上线了',socket.id,13)
            // console.log(users,14)
        })
        socket.on('sendMsg',(message,sender,receiver,sendTime,avatar) => {
            console.log(message,sender,receiver,sendTime,avatar)
            if (users[receiver]){
                socket.to(users[receiver]).emit('receiveMessage',message,sender,sendTime,avatar)
            }
            //对方不在线，将消息存储到mongoDB中
            else {
                console.log(users[receiver])
            }
        })
        socket.on('disconnecting',() => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.id]
                console.log(socket.id+'离线了',20)
                console.log(users,21)
            }

        })
    })
}