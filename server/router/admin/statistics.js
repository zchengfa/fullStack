const {sortArray} = require("../../util/arrayOperation");

module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const connection = require('../../plugins/connectMysql')()
    const {selectWithInnerJoin,selectFields,selectCount} = require('../../plugins/mysql_query')
    const {findAllIndexByObjectValue} = require('../../util/arrayOperation')
    const {sortArray} = require('../../util/arrayOperation')

    router.get('/statisticsData',(req, res) => {
        
      //获取用户消费数据，商品销量数据，关键词搜索数据
			//1.获取用户消费数据

        const selectUser = selectWithInnerJoin('mall_store_order','mall_user','O.user_id,account,username,total_price','O','U','O.user_id = U.user_id and O.payment_status = 2')


        let p = new Promise(resolve => {
            let allResult = []
            connection.query(selectUser,(err,result)=>{
                if (err) throw err
                if (result) {

                    //获取数组中所有对象中的user_id
                    let idAllArr = []
                    result.map(item => {
                        idAllArr.push(item.user_id)
                    })

                    //获取重复出现两次及以上的user_id
                    let idRepeatArr = []
                    let onceIdArr = []
                    idAllArr.map(id => {
                        if (idRepeatArr.indexOf(id) === -1 && idAllArr.indexOf(id) !== idAllArr.lastIndexOf(id)) {
                            idRepeatArr.push(id)
                        }
                        //获取只出现一次的user_id
                        if (onceIdArr.indexOf(id) === -1 && idAllArr.indexOf(id) === idAllArr.lastIndexOf(id)) {
                            onceIdArr.push(id)
                        }
                    })

                    let onceUserConsumption = []
                    if (onceIdArr.length) {
                        onceIdArr.map(once => {
                            result.map(r => {
                                if (once === r.user_id) {
                                    onceUserConsumption.push({
                                        'user_id': r.user_id,
                                        'username': r.username,
                                        'account': r.account,
                                        'totalConsumption': r.total_price
                                    })
                                }
                            })
                        })
                    }

                    //获取重复两次及以上user_id在result数组中所出现的所有索引
                    let repeatResult = []
                    idRepeatArr.map(repeat => {
                        repeatResult.push({
                            'id': repeat,
                            'indexArr': findAllIndexByObjectValue(result, 'user_id', repeat)
                        })
                    })

                    //通过获取到的所有索引，将result中重复出现的用户消费价格进行总和，得到每个用户的总消费
                    let repeatUserConsumption = []
                    repeatResult.map(item => {
                        let totalConsumption = 0, username = null, account = null
                        item.indexArr.map(items => {
                            username = result[items]['username']
                            account = result[items]['account']
                            totalConsumption += result[items]['total_price']
                        })
                        repeatUserConsumption.push({
                            'user_id': item.id,
                            'username': username,
                            'account': account,
                            'totalConsumption': totalConsumption
                        })
                    })

                    let newUserConsumption = sortArray([].concat(onceUserConsumption, repeatUserConsumption), 'totalConsumption')

                    //对数组进行由大到小排序
                    allResult.push({
                        'userConsumption': newUserConsumption
                    })

                    resolve(allResult)
                }
            })
        })

        p.then(result=>{
            return  new Promise(resolve => {
                 //2.获取商品类型销量榜
                 const selectProductSales = selectFields('mall_goods', 'product_id,product_type,price,sales,discount')
                 connection.query(selectProductSales, (err, sales) => {
                     if (err) throw err
                     if (sales.length) {

                         //获取结果数组中含有的商品类型
                         let typeArr = []
                         sales.map(item => {
                             if (typeArr.indexOf(item.product_type) === -1) {
                                 typeArr.push(item.product_type)
                             }
                         })

                         //根据商品类型获取每种商品类型中每件商品的销量以及金额
                         let productSC = []
                         typeArr.map((t, index) => {
                             productSC.push({
                                 'type': t,
                                 'sales': [],
                                 'consumption': []
                             })
                             sales.map(s => {
                                 if (productSC[index]['type'] === s.product_type) {
                                     productSC[index]['sales'].push(s.sales)
                                     productSC[index]['consumption'].push(s.sales * s.price * s.discount)
                                 }
                             })
                         })

                         //总和商品类型的销量和金额
                         productSC.map((sc, index) => {
                             let totalSales = 0, totalConsumption = 0, settleCount = sc.sales.length
                             for (let i = 0; i < settleCount; i++) {
                                 totalSales += sc.sales[i]
                                 totalConsumption += sc.consumption[i]
                             }
                             productSC[index]['sales'] = totalSales
                             productSC[index]['consumption'] = totalConsumption
                         })

                         //先将数组进行排序再添加到另一个数组中
                         result.push({
                             'productSales': sortArray(productSC, 'sales')
                         })
                         resolve(result)

                     }
                 })
             })
        }).then(resultTwo=>{
            return new Promise(resolve => {
                //3.获取搜索词数据
                const selectKeywords = selectFields('mall_user_search_word','word,search_count')
                connection.query(selectKeywords,(err,word)=> {
                    if (err) throw err
                    resultTwo.push({
                        'words': sortArray(word, 'search_count')
                    })

                    resolve(resultTwo)
                })
            })
        }).then(resultThree=>{
            return new Promise(resolve => {
                //获取项目的用户数量，商品数量，以及访客数据，未完成订单数，已完成订单数
                const selectGoodsCount = selectCount('mall_goods')
                const selectUserCount = selectCount('mall_user')
                const selectVisitor = selectFields('mall_visitor','count,time')
                const selectNotFinish = selectCount('mall_store_order','payment_status = 0 OR payment_status = 1 OR payment_status = 4')
                const selectFinish = selectCount('mall_store_order','payment_status = 2 OR payment_status = 3 OR payment_status = 5')

                connection.query(`${selectUserCount+';'+selectGoodsCount+';'+selectVisitor+';'+selectNotFinish+';'+selectFinish}`,(err,results)=>{
                    if (err) throw err
                    if (results) {
                        resultThree.push({
                            'total_user': results[0][0]['COUNT(1)'],
                            'total_goods': results[1][0]['COUNT(1)'],
                            'visitor': results[2],
                            'order_not_finish': results[3][0]['COUNT(1)'],
                            'order_finished': results[4][0]['COUNT(1)']
                        })
                        resolve(resultThree)
                    }

                })
            }).then(resultFour=>{
            return new Promise(resolve => {
                    const selectProductType = selectFields('mall_goods','product_type,sales')
                    connection.query(selectProductType,(err,result)=>{
                        if (err) throw err
                        if (result){
                            let arr = []
                            result.map(item=>{
                                if (arr.indexOf(item.product_type) === -1){
                                    arr.push(item.product_type)
                                }
                            })
                            let data = []
                            arr.map(type=>{
                                let sales = 0
                                result.map(res=>{
                                    if (type===res.product_type){
                                        sales += res.sales
                                    }
                                })
                                data.push({
                                    'name':type,
                                    'value':sales
                                })

                            })

                            //降序
                            data = sortArray(data,'sales')

                            //只返回前四数据
                            resultFour.push({
                                'sales':data.splice(0,10)
                            })
                            resolve(resultFour)
                        }
                    })
                })
            }).then(resultFive=>{
                res.send(resultFive)
            })
        })
    })
	
    app.use('/admin',router)
}