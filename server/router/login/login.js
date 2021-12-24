const {timeFormatting} = require("../../util/timeFormatting");
const mysql_query = require("../../plugins/mysql_query");
module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/login', (req, res) => {
        //将请求参数转换成对象
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        //连接mysql数据库，查询是否有与参数一致的用户名和密码
        const connection = require('../../plugins/connectMysql')()
        const mysql_query = require('../../plugins/mysql_query')
        //创建查询用户名语句
        const selectUser_id = mysql_query.selectFields('mall_user','account',`account = '${paramsObj.account}'`)

        const select_query = mysql_query.selectFields('mall_user','account,username,user_id,avatar',`account = '${paramsObj.account}' AND password = '${paramsObj.pwd}'`)

        connection.query(selectUser_id, (err, result) => {
            if (err) throw err
            else {
                //用户存在，判断用户名与密码是否一致
                if (Object.keys(result).length) {
                    //数据库查询
                    connection.query(select_query, (err, results) => {
                        if (err) console.log(err)

                        //判断是否已有匹配项，有匹配项即账号密码正确，允许登录，生成token并发送给前端
                        if (Object.keys(results).length !==0) {
                            const {createToken} = require('../../util/token')
                            const user = {
                                username:results[0]['username'],
                                account:results[0]['account'],
                                user_id:results[0]['user_id'],
                                avatar:results[0]['avatar']
                            }
                            //生成token,当过期时间number类型时以秒计算
                            const token = createToken(user,'1d')
									

                    
                            //将生成的token存入数据库中
                            const update = mysql_query.update('mall_user',`token = '${token}'`,`account = '${results[0]['account']}'`)

                            connection.query(update, (err) => {
                                if (err) throw err
                                else {
                                    console.log('token write success')
                                    //用户token写入成功，将token和用户信息返回给前台
                                    try{

                                        //将当前时间作为用户登录时间，并记录在数据库中
                                        const {timeFormatting} = require('../../util/timeFormatting')
                                        let loginTime = timeFormatting("YYYY-MM-DD HH:MM:SS")
                                        const updateQuery = mysql_query.update('mall_user',`last_login_time = '${loginTime}'`,`user_id = "${results[0]['user_id']}"`)
                                        connection.query(updateQuery,(err,l)=>{
                                            if(err) throw err
                                            else{
                                                console.log('用户登录时间已保存至数据库',l)
                                                res.send({'token':token,'userInfo':user})
                                            }
                                        })
                                    }catch(e){
                                        console.log(e)
                                    }
																		
                                }
                            })

                            console.log('login success')
                        }
                        //没有匹配项，不允许登录，并将错误信息发送给前端让其提示用户
                        else {
                            res.send({'err':'账号或密码错误'})
                            console.log('password is not correct')
                        }

                    })
                }
                //用户名不存在，返回提示给前端
                else {
                    res.send({'non_exist':'账号不存在'})
                    console.log('account is not exist')
                }
            }
        })

        console.log(paramsObj)
    })

    app.use('/', router)
}