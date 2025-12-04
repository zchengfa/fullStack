const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../util/token')
const {currentFileName} = require("../../util/util");
module.exports = (app,prisma) => {
    //接收前端获取管理员信息请求
    router.post('/administratorInfo',(req, res) => {
        const paramObj = JSON.parse(JSON.stringify(req.body))

        try{
            verifyToken(paramObj.token,(err,decode)=>{
                if (err){
                    res.send(err)
                }
                else {
                    res.send({'info':decode})
                }
            })
        }
        catch (e) {
            console.log(currentFileName(__filename)+ e)
            res.status(500).send({errMessage:'服务器出现错误'})
        }
    })

    //接收前端获取商品数据请求
    router.get('/shopManage',async (req, res) => {
        try{
            const prismaGoodsQuery = await prisma.mall_goods.findMany()
            const data = prismaGoodsQuery.map((product)=>{
                product.id = product.id.toString()
                product.brand_id = product.brand_id.toString()
                return product
            })
            res.send(data)
        }
        catch (e) {
            console.log(currentFileName(__filename)+ e)
            res.status(500).send({errMessage:'服务器出现错误'})
        }

    })

    router.post('/addProduct', async (req, res) => {
        try {
            const paramsObj = req.body; // 无需 JSON.parse(JSON.stringify())
            const productID = require('../../util/createProductID')();

            // 参数验证
            if (!paramsObj.description || !paramsObj.imageLink || !paramsObj.price || !paramsObj.productCount) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要的商品信息参数'
                });
            }

            // 构建插入数据 - 使用 Prisma 的类型安全结构
            const productData = {
                product_id: productID,
                type: ['pop', 'sell', 'new'][Math.round(Math.random() * 2)],
                page: Math.round(Math.random() * 10),
                product_title: paramsObj.description,
                product_image: paramsObj.imageLink,
                price: `￥${paramsObj.price}`,
                origin_price: `￥${(paramsObj.price * 1.2).toFixed(1)}`,
                stocks: paramsObj.productCount.toString(),
                createdAt: new Date(), // 添加时间戳
                updatedAt: new Date()
            };

            // 使用 Prisma 创建商品
            const newProduct = await prisma.mall_goods.create({
                data: productData,
                select: {
                    product_id: true,
                    title: true,
                    price: true,
                    type: true,
                    createdAt: true
                }
            });

            res.status(201).json({
                success: true,
                message: '商品添加成功',
                product_id: productID,
                data: newProduct
            });

        } catch (error) {
            console.error('添加商品失败:', error);

            // 处理 Prisma 特定错误
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    error: '商品ID已存在',
                    message: '添加商品失败，请重试'
                });
            }

            res.status(500).json({
                success: false,
                err:'服务器内部错误',
                message: '添加商品失败'
            });
        }
    })

    router.post('/alterProduct',async (req,res)=>{
        const bodyData = JSON.parse(JSON.stringify(req.body))
        const product_id = bodyData.product_id.toString()
        const paramsObj = bodyData.alterData
	    try{
            await prisma.mall_goods.update({
                where:{
                    product_id:product_id,
                },
                data:{
                    product_title: paramsObj.title,
                    product_image: paramsObj.imagePath,
                    stocks:paramsObj.count,
                    price: paramsObj.price
                }
            })

            res.send({'success':'编辑成功'})

        }
        catch (e) {
            console.log(currentFileName(__filename)+ e)
            res.status(500).send({errMessage:'服务器出现错误'})
        }
    })

    router.post('/deleteProduct', async (req, res) => {
        try {
            const {product_id} = req.body;

            // 参数验证
            if (!product_id) {
                return res.status(400).json({
                    success: false,
                    error: '缺少商品ID参数'
                });
            }

            // 检查商品是否存在
            const existingProduct = await prisma.mall_goods.findUnique({
                where: {product_id: product_id},
                select: {product_id: true, product_title: true}
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    error: '未找到对应的商品',
                    message: `商品ID ${product_id} 不存在`
                });
            }

            // 执行删除操作
            const deletedProduct = await prisma.mall_goods.delete({
                where: {product_id: product_id},
                select: {
                    product_id: true,
                    product_title: true
                }
            });

            res.json({
                success: true,
                message: '商品删除成功',
                data: deletedProduct
            });

        } catch (error) {
            console.error('删除商品失败:', error);

            // 处理 Prisma 特定错误
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: '商品不存在或已被删除',
                    message: '删除操作失败'
                });
            }
            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '删除商品失败'
            });
        }
    })
    app.use('/admin',router)
}
