import io from 'socket.io-client'

const socket = io('ws://192.168.1.103:3000')

function emitCommunication (event,callback) {
    return socket.emit(event,callback)
}

function recieveCommunication (event,callback) {
    return socket.on(event,callback)
}

export default socket

