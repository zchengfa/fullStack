module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server,{
        cors:{
            origin:'*'
        }
    })
    let users = {}

    io.on('connection', (socket) => {
        console.log(socket.id)
        socket.on('online', data => {
            users[data] = socket.id
            socket.name = data
            // console.log('用户:'+data + '上线了',socket.id)
             console.log(users)
        })
        socket.on('send',res => {
            console.log( socket.id,users[res.sender],users[res.receiver])
            socket.emit('response',res)

        })


        socket.on('disconnecting',() => {

            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
                console.log(socket.id+'离线了')
            }
            console.log(users)
        })
    })

}