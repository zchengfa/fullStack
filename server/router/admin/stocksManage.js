const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../util/token')
const {currentFileName} = require("../../util/util");

module.exports = (app,prisma) => {
    // 接收前端获取库存数据请求
    router.get('/stocks', async (req, res) => {
        try {
            const prismaGoodsQuery = await prisma.mall_goods.findMany()
            const data = prismaGoodsQuery.map((product) => {
                return {
                    product_id: product.product_id,
                    product_title: product.product_title,
                    product_image: product.product_image,
                    stocks: parseInt(product.stocks),
                    price: product.price,
                    product_type: product.type
                }
            })
            res.send(data)
        } catch (e) {
            console.log(currentFileName(__filename) + e)
            res.status(500).send({errMessage: '服务器出现错误'})
        }
    })

    // 接收前端更新库存数据请求
    router.post('/alterStock', async (req, res) => {
        const bodyData = JSON.parse(JSON.stringify(req.body))
        const product_id = bodyData.product_id.toString()
        const stocks = bodyData.stocks.toString()

        try {
            await prisma.mall_goods.update({
                where: {
                    product_id: product_id,
                },
                data: {
                    stocks: stocks
                }
            })

            res.send({'success': '库存更新成功'})
        } catch (e) {
            console.log(currentFileName(__filename) + e)
            res.status(500).send({errMessage: '服务器出现错误'})
        }
    })

    app.use('/admin', router)
}
