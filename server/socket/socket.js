const openAi = require('../plugins/AI.js');
const {verifyTokenAsync} = require("../util/token");
const {currentFileName} = require("../util/util");

module.exports = (server,prisma) => {
    const socket = require('socket.io');

    const io = socket(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        },
        // 连接配置优化
        Timeout: 60000,
        pingInterval: 25000
    });

    // 用户连接管理
    const userConnections = new Map(); // 使用 Map 替代对象，性能更好
    const connectedClients = new Set();

    // 认证中间件
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('认证失败：缺少访问令牌'));
            }

            // 验证用户令牌（根据您的认证系统实现）
            const user = await verifyTokenAsync(token);

            if (!user) {
                return next(new Error('认证失败：无效令牌'));
            }

            socket.userId = user.id;
            socket.username = user.username;
            next();
        } catch (error) {
            next(new Error('认证失败：' + error.message));
        }
    });

    io.on('connection', async (socket) => {
        try {
            connectedClients.add(socket);

            console.log(`✅ 用户连接: ${socket.username} (ID: ${socket.userId}), Socket ID: ${socket.id}`);

            // 用户上线处理
            socket.on('online', async (userData) => {
                try {
                    // 存储用户连接信息
                    userConnections.set(socket.userId, {
                        socketId: socket.id,
                        username: socket.username,
                        connectedAt: new Date(),
                        lastActive: new Date()
                    });

                    // 加入用户专属房间
                    socket.join(`user:${socket.userId}`);

                    // 更新用户在线状态
                    await updateUserOnlineStatus(socket.userId, true);

                    console.log(`用户上线: ${socket.username}, 当前在线用户: ${userConnections.size}`);

                    // 通知用户上线
                    socket.broadcast.emit('userOnline', {
                        userId: socket.userId,
                        username: socket.username,
                        timestamp: new Date()
                    });
                } catch (error) {
                    console.error('处理用户上线状态错误:', error);
                    socket.emit('error', { message: '上线状态更新失败' });
                }
            });

            // AI 聊天功能优化
            socket.on('askAI', async (question) => {
                try {
                    if (!question || question.trim().length === 0) {
                        return socket.emit('error', { message: '问题不能为空' });
                    }

                    if (question.length > 1000) {
                        return socket.emit('error', { message: '问题长度超过限制' });
                    }

                    // 记录 AI 对话日志
                    await prisma.aI_conversation.create({
                        data: {
                            user_id: socket.userId,
                            question: question,
                            timestamp: new Date()
                        }
                    });

                    const aiResponse = await openAi.chat(question);

                    let fullResponse = '';
                    for await (const chunk of aiResponse) {
                        if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
                            const content = chunk.choices[0]?.delta?.content || '';
                            fullResponse += content;

                            socket.emit('AIResults', {
                                time: chunk.created,
                                isFinishAnswer: false,
                                content: content
                            });
                        }
                    }

                    // 发送完成信号
                    socket.emit('AIResults', {
                        time: new Date(),
                        isFinishAnswer: true,
                        content: ''
                    });

                    // 保存完整的 AI 响应
                    await prisma.aI_conversation.updateMany({
                        where: {
                            user_id: socket.userId,
                            question: question
                        },
                        data: {
                            response: fullResponse,
                            responded_at: new Date()
                        }
                    });

                } catch (error) {
                    console.error(`${currentFileName(__filename)}处理错误:`, error);
                    socket.emit('error', {
                        message: 'AI 服务暂时不可用，请稍后重试',
                        code: 'AI_SERVICE_ERROR'
                    });

                    // 记录错误日志
                    await prisma.error_log.create({
                        data: {
                            user_id: socket.userId,
                            error_type: 'AI_SERVICE',
                            error_message: error.message,
                            timestamp: new Date()
                        }
                    });
                }
            });

            // 消息发送功能优化
            socket.on('sendMsg', async (messageData) => {
                try {
                    const { message, sender, receiver, sendTime, avatar } = messageData;

                    // 输入验证
                    if (!message || !sender || !receiver) {
                        return socket.emit('error', { message: '缺少必要的消息参数' });
                    }

                    if (message.length > 5000) {
                        return socket.emit('error', { message: '消息长度超过限制' });
                    }

                    // 使用 Prisma 存储消息
                    const savedMessage = await prisma.message.create({
                        data: {
                            content: message,
                            sender_id: sender,
                            receiver_id: receiver,
                            send_time: new Date(sendTime),
                            avatar: avatar,
                            status: 'sent',
                            include: {
                                sender: {
                                    select: {username: true, avatar: true}
                                },
                                receiver: {
                                    select: {username: true, avatar: true}
                                }
                            }
                        }
                    })
                    // 检查接收者是否在线
                    const receiverConnection = userConnections.get(receiver);

                    if (receiverConnection) {
                        // 接收者在线，实时推送消息
                        socket.to(receiverConnection.socketId).emit('receiveMessage', {
                            id: savedMessage.id,
                            message: savedMessage.content,
                            sender: savedMessage.sender,
                            sendTime: savedMessage.send_time,
                            avatar: savedMessage.avatar
                        });

                        // 更新消息状态为已送达
                        await prisma.message.update({
                            where: { id: savedMessage.id },
                            data: { status: 'delivered' }
                        });
                    } else {
                        // 接收者不在线，消息已存储，状态保持为 sent
                        console.log(`${currentFileName(__filename,true)}用户 ${receiver} 不在线，消息已存储`);
                    }

                    // 发送回执给发送者
                    socket.emit('messageSent', {
                        messageId: savedMessage.id,
                        status: receiverConnection ? 'delivered' : 'sent',
                        timestamp: new Date()
                    });

                } catch (error) {
                        console.error('发送消息错误:', error);
                        socket.emit('error', {
                            message: '消息发送失败',
                            code: 'MESSAGE_SEND_ERROR'
                        });
                    }
                });

                // 消息已读回执
                socket.on('markAsRead', async (messageId) => {
                    try {
                        await prisma.message.update({
                            where: { id: messageId },
                            data: {
                                status: 'read',
                                read_at: new Date()
                            }
                        });

                        // 通知发送者消息已读
                        const message = await prisma.message.findUnique({
                            where: { id: messageId },
                            select: { sender_id: true }
                        });

                        if (message) {
                            const senderConnection = userConnections.get(message.sender_id);
                            if (senderConnection) {
                                socket.to(senderConnection.socketId).emit('messageRead', {
                                    messageId: messageId,
                                    readAt: new Date()
                                });
                            }
                        }
                    } catch (error) {
                        console.error(`${currentFileName(__filename)}标记消息已读错误:`, error);
                    }
                });

                // 处理连接断开
                socket.on('disconnecting', async (reason) => {
                    try {
                        console.log(`${currentFileName(__filename,true)}用户断开连接: ${socket.username}, 原因: ${reason}`);

                        // 更新用户在线状态
                        if (socket.userId) {
                            await updateUserOnlineStatus(socket.userId, false);
                            userConnections.delete(socket.userId);
                        }

                        // 通知其他用户该用户下线
                        socket.broadcast.emit('userOffline', {
                            userId: socket.userId,
                            username: socket.username,
                            timestamp: new Date()
                        });
                    } catch (error) {
                        console.error(`${currentFileName(__filename)}处理用户下线错误:`, error);
                    }
                });

                socket.on('disconnect', () => {
                    connectedClients.delete(socket);
                    console.log(`${currentFileName(__filename,true)}连接完全关闭: ${socket.username}, 剩余连接数: ${connectedClients.size}`);
                });

                // 错误处理
                socket.on('error', (error) => {
                    console.error(`${currentFileName(__filename)}Socket 错误:`, error);
                });

            } catch (error) {
                console.error(`${currentFileName(__filename)}连接处理错误:`, error);
                socket.emit('error', { message: '连接处理失败' });
            }
        });

        async function updateUserOnlineStatus(userId, isOnline) {
            try {
                const prismaUserQuery = await prisma.user.findUnique({
                    where: { id: userId },
                })

                if(!prismaUserQuery){
                    const prismaUser = await prisma.mall_administrator.findUnique({
                        where: { user_id: Number(userId) },
                        select: {
                            username:true,
                            avatar:true
                        }
                    })
                    await prisma.user.create({
                        data:{
                            id:userId,
                            username:prismaUser.username,
                            avatar:prismaUser.avatar,
                            is_online:isOnline,
                            last_seen: isOnline ? new Date() : new Date()
                        }
                    })
                }
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        is_online: isOnline,
                        last_seen: isOnline ? new Date() : new Date()
                    }
                });
            } catch (error) {
                console.error(`${currentFileName(__filename)}更新用户在线状态错误:`, error);
            }
        }

        // 定期清理失效连接
        setInterval(() => {
            const now = new Date();
            for (const [userId, connection] of userConnections.entries()) {
                if (now - connection.lastActive > 300000) { // 5分钟无活动
                    userConnections.delete(userId);
                    console.log(`${currentFileName(__filename,true)}清理失效连接: ${userId}`);
                }
            }
        }, 60000); // 每分钟检查一次

        // 优雅关闭处理
        process.on('SIGINT', async () => {
            console.log(`${currentFileName(__filename,true)}正在关闭 Socket.IO 服务器...`);

            // 更新所有用户为离线状态
            const onlineUsers = Array.from(userConnections.keys());
            for (const userId of onlineUsers) {
                await updateUserOnlineStatus(userId, false);
            }

            // 关闭 Prisma 连接
            await prisma.$disconnect();

            // 关闭 Socket.IO
            io.close(() => {
                console.log('Socket.IO 服务器已关闭');
                process.exit(0);
            });
        });

        return io;
    }
