const connection = require('../../plugins/connectMysql')();
const mysql_query = require('../../plugins/mysql_query')
module.exports = (app)=>{
    //用于作者提交商品数据至数据库的api
    app.post('/submitDataApi', (req, res) => {
        let paramsObj = JSON.parse(JSON.stringify(req.body)).data
        let shop_num = 42
        const ID = require('../../util/createProductID')()
        getBrandIdByBrandName(paramsObj.brand, (err, result) => {
            if (err) throw err
            else {
                let brand_id = null
                result ? brand_id = result[0]['brand_id'] : null
                if (result) {
                    getDataTotalNumber((err, total_num) => {
                        if (err) throw err
                        else {
                            let totalNum = null
                            total_num ? totalNum = total_num[0]['COUNT(1)'] : null
                            let pageNum = getPageNum(shop_num, totalNum)
                            if (totalNum) {
                                //将前端提交的商品数据存储到数据库
                                connection.query(mysql_query.insert('mall_goods', 'product_id,product_title,product_image,' +
                                        'product_type,product_brand,preferential_type,price,sales,favorite,sell_type,stocks,unit,isHot,isPreferential,comment_number,brand_id,page,discount',
                                        `'${ID}','${paramsObj.description}','${paramsObj.imagePath}','${paramsObj.type}',
                                        '${paramsObj.brand}','${paramsObj['preferential_type']}',${paramsObj.price},${paramsObj['sales']},${paramsObj.favorite},'${paramsObj['sell_type']}',
                                        ${paramsObj['stocks']},'${paramsObj.unit}',${paramsObj['isHot']},${paramsObj['isPreferential']},${paramsObj['comments']},${brand_id},${pageNum},${paramsObj.discount}`),
                                    (err, result) => {
                                        if (err) throw err
                                        else {
                                            if (result) {

                                                let isOver = false
                                                paramsObj.params.map(item => {
                                                    //将商品参数插入到mall_goods_attribute表中
                                                    connection.query(mysql_query.insert('mall_goods_attribute', 'product_id,attribute_title,attribute', `'${ID}','${item.title + '：'}','${item.text}'`),
                                                        (err) => {
                                                            if (err) throw err
                                                        })
                                                    return isOver = true
                                                })

                                                //将商品详情页的图列数据插入到mall_goods_gallery表中
                                                //1.查看图列字符串中是否含有分号，若有判断有几个，若没有，当成一张图片地址进行插入

                                                //没有分号
                                                if (paramsObj['gallery'].indexOf(';') === -1) {
                                                    insertImageGallery(ID, paramsObj['gallery'])
                                                }
                                                //有分号
                                                else {
                                                    //1.先判断有几个分号
                                                    let gallery_arr = paramsObj['gallery'].split(';')
                                                    gallery_arr.map(item => {
                                                        item ? insertImageGallery(ID, item) : null
                                                    })
                                                }
                                                isOver ? res.send({'success': '添加成功'}) : false
                                            }
                                        }
                                    })
                            }
                        }
                    })
                }

            }

        })


        function insertImageGallery(ID, gallery) {
            connection.query(mysql_query.insert('mall_goods_gallery', 'product_id,product_image', `'${ID}','${gallery}'`), (err, re) => {
                if (err) throw err
            })
        }

        function getBrandIdByBrandName(brand, callback) {
            const selectBrandId = mysql_query.selectFields('mall_brand', 'brand_id', `brand = '${brand}'`)
            connection.query(selectBrandId, callback)
        }

        function getDataTotalNumber(callback) {
            const selectCount = mysql_query.selectCount('mall_goods', `sell_type = '${paramsObj['sell_type']}'`)
            connection.query(selectCount, callback)
        }

        function getPageNum(shopNum, total_num) {
            let stringIndex = (total_num / shopNum).toFixed(2).toString().indexOf('.')
            let pageNumString = (total_num / shopNum).toFixed(2).toString()
            return Number(pageNumString.substring(0, stringIndex)) + 1
        }

    })
}
