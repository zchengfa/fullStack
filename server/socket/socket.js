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
            console.log(users,14)
        })
        socket.on('sendMsg',(message,sender,receiver) => {
            console.log(message,sender,receiver)
            socket.to(users[receiver]).emit('sendMsgToReceiver',message,sender)
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