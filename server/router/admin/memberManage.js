module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const connect = require('../../plugins/connectMysql')
    const {selectFields,deleteOperation} = require('../../plugins/mysql_query')

		const connection = connect()
    router.get('/memberManage',(req, res) => {
        
      const selectUser = selectFields('mall_user','user_id,account,username,identity,register_time,last_login_time')
      connection.query(selectUser, (err,result) => {
          if (err) throw err
          else {
              res.send(result)
          }
      })
    })
		
		router.post('/deleteUser',(req,res)=>{
			const user_id = JSON.parse(JSON.stringify(req.body)).user_id
			//console.log(user_id)
			const deleteUserQuery = deleteOperation('mall_user',`user_id = ${user_id}`)
			connection.query(deleteUserQuery,(err,result) => {
				if(err) {
					throw err
				}
				else{
					if(Object.keys(result)){
						res.send({"success":"删除成功"})
					}
				}
			})
		
		})

    app.use('/admin',router)
}