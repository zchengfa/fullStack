const poll = require('../plugins/pollDatabaseLog.js');
const openAi = require('../plugins/AI.js');
module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server,{
        cors:{
            origin:'*'
        }
    })

    const {messageModel} = require('../model/model')

    let users = {},clients = [];
    io.on('connection', socket => {
        clients.push(socket);
        socket.on('online',user => {
            users[user] = socket.id
            socket.name = user
            console.log(user + '上线了',socket.id,13)
        })
        // 大屏可视化所需数据获取
        //poll(clients);
        // 大屏可视化所需数据获取

        //AI
        socket.on('askAI',(question)=>{
            openAi.chat(question).then(completion =>{
                socket.emit('AIResults',completion)
            }).catch(err => {
                console.log(err);
            })
            // setTimeout(()=>{
            //     socket.emit('AIResults',{
            //         choices:[
            //             {
            //                 message:{
            //                     content:'我是一条测试消息',
            //                     role: 'assistant'
            //                 }
            //             }
            //         ]
            //     })
            // },1000)
        })
        //AI

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
