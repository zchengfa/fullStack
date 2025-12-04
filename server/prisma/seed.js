//初始化数据库数据
const {currentFileName} = require("../util/util");
module.exports =async (prisma) =>{
    try{
        const prismaQuery = await prisma.mall_administrator.findFirst({
            select:{
                id: true
            }
        })
        //没有找到，说明数据表是空的，可以插入数据
        if(!prismaQuery){
            await prisma.mall_administrator.create({
                data:{
                    id: 1,
                    user_id: 3462961444402,
                    account: "13333333333",
                    username: "admin",
                    password: "0FA00516C7FA7350DED84B110C438F04",
                    avatar: "https://img0.baidu.com/it/u=2039617711,3299579382&fm=253&fmt=auto&app=138&f=JPEG?w=380&h=380",
                    gender: false,
                    last_login_time: new Date('2025-12-04 07:05:13'),
                    identity: 9999
                }
            })

            console.log(`${currentFileName(__filename,true)}数据库表mall_administrator初始化成功`);
        }

    }
    catch(err){
        console.log(`${currentFileName(__filename)}数据库初始化失败`+err);
    }
}

