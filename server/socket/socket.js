module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server)

    io.on('connection', () => {
        console.log('用户连接了')
    })
}