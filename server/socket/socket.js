module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server,{
        cors:{
            origin:'*'
        }
    })

    io.on('connection', (socket) => {
        socket.on('send',data => {
            console.log(data)
            socket.emit('response', {'message':'您好！我是mall商城客服，有什么需要帮助的么？'})
        })
    })
}