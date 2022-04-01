const Console = require("console");
const mysql_query = require("../../plugins/mysql_query");
module.exports = app=>{
  const express = require('express')
  const router = express.Router()

  const connection = require('../../plugins/connectMysql')()
  const mysql_query = require('../../plugins/mysql_query')

  router.get('/home/api/search',(req, res) => {
    let keyword = req.query.keyword

    //查询数据库是否已经存在该关键词了
    const selectKeyword = mysql_query.selectAll('mall_user_search_word',`word = '${keyword}'`)
    connection.query(selectKeyword,(err,result)=>{
      if (err) throw err
      if (result.length){
        let search_count = result[0]['search_count'] + 1
        const updateSearchCount = mysql_query.update('mall_user_search_word',`search_count = ${search_count}`,`word = '${keyword}'`)
        connection.query(updateSearchCount,(err)=>{
          if (err) throw err
          res.sendStatus(200)
        })
      }
      else{
        const insertKeyword = mysql_query.insert('mall_user_search_word','word,search_count',`'${keyword}',1`)
        connection.query(insertKeyword,(err)=>{
          if (err) throw err
          res.sendStatus(200)
        })
      }
    })
  })

  router.get('/home/api/hotSearch',(req, res) => {
    const selectHotSearch = mysql_query.selectAllOrderByFields('mall_user_search_word','','search_count','desc')
    connection.query(selectHotSearch,(err,result)=>{
      if (err) throw err
      res.send(result.slice(0,10))
    })
  })

  router.get('/home/api/searchProduct',(req, res) => {
    let keyword = req.query.keyword

    //使用like模糊查询
    const selectProduct = `select * from mall_goods where product_title like '%${keyword}%' or product_brand like '%${keyword}%' or product_type like '%${keyword}%' or sell_type like '%${keyword}%'`
    connection.query(selectProduct,(err,result)=>{
      if (err) throw err
      res.send(result)
    })
  })

  app.use('/',router)
}