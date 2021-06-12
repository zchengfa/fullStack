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
        const connect = require('../../plugins/connectMysql')
        const mysql_query = require('../../plugins/mysql_query')
        //创建查询用户名语句
        const selectUser_id = mysql_query.selectFields('user','account',`account = '${paramsObj.username}'`)

        const select_query = mysql_query.selectFields('user','account,user_id,header_image',`account = '${paramsObj.username}' AND password = '${paramsObj.pwd}'`)


        //连接数据库
        const connection = connect()

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
                            const jwt = require('jsonwebtoken')
                            const user = {
                                username:results[0]['account'],
                                user_id:results[0]['user_id'],
                                avatar:results[0]['header_image']
                            }
                            //生成token,当过期时间number类型时以秒计算
                            const token = jwt.sign(user,'user',{expiresIn: '1d'})

                            console.log(results[0])
                            //将生成的token存入数据库中
                            const update = mysql_query.update('user',`token = '${token}'`,`account = '${results[0]['account']}'`)

                            connection.query(update, (err) => {
                                if (err) throw err
                                else {
                                    console.log('token write success')
                                    res.setHeader('Access-Control-Allow-Origin', '*')
                                    res.send({'token':token})
                                }
                            })

                            console.log('longin success')
                        }
                        //没有匹配项，不允许登录，并将错误信息发送给前端让其提示用户
                        else {
                            res.setHeader('Access-Control-Allow-Origin', '*')
                            res.send({'err':'账号或密码错误'})
                            console.log('password is not correct')
                        }

                    })
                }
                //用户名不存在，返回提示给前端
                else {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'non_exist':'账号不存在'})
                    console.log('account is not exist')
                }
            }
        })

        console.log(paramsObj)
    })

    app.use('/', router)
}