module.exports = (app,prisma) => {
    app.post('/submitDataApi', async (req, res) => {
        try {
            // 1. 参数解析与验证
            const paramsObj = JSON.parse(JSON.stringify(req.body)).data;
            const ID = require('../../util/createProductID')();
            const shop_num = 42;

            // 2. 查找品牌ID（使用Prisma的findFirst方法）
            const brandRecord = await prisma.mall_brand.findFirst({
                where: { brand: paramsObj.brand },
                select: { brand_id: true }
            });
            const brand_id = brandRecord ? brandRecord.brand_id : null;

            // 3. 计算商品总数和页码
            const goodsCount = await prisma.mall_goods.count({
                where: { sell_type: paramsObj.sell_type }
            });
            const pageNum = Math.floor(goodsCount / shop_num) + 1;

            // 4. 使用Prisma事务确保所有数据库操作的原子性
            const result = await prisma.$transaction(async (tx) => {
                // 4.1 插入主商品信息
                const newProduct = await tx.mall_goods.create({
                    data: {
                        product_id: ID,
                        product_title: paramsObj.description,
                        product_image: paramsObj.imagePath,
                        product_type: paramsObj.type,
                        product_brand: paramsObj.brand,
                        preferential_type: paramsObj.preferential_type,
                        price: paramsObj.price,
                        sales: paramsObj.sales,
                        favorite: paramsObj.favorite,
                        sell_type: paramsObj.sell_type,
                        stocks: paramsObj.st,                        unit: paramsObj.unit,
                        isHot: paramsObj.isHot,
                        isPreferential: paramsObj.isPreferential,
                        comment_number: paramsObj.comments,
                        brand_id: brand_id,
                        page: pageNum,
                        discount: paramsObj.discount
                    }
                });

                // 4.2 批量插入商品参数属性（使用createMany提高效率）
                if (paramsObj.params && paramsObj.params.length > 0) {
                    const attributeData = paramsObj.params.map(item => ({
                        product_id: ID,
                        attribute_title: `${item.title}：`,
                        attribute: item.text
                    }));
                    await tx.mall_goods_attribute.createMany({
                        data: attributeData
                    });
                }

                // 4.3 处理商品图库（支持单张和多张图片）
                if (paramsObj.gallery) {
                    let galleryArray = [];
                    if (paramsObj.gallery.indexOf(';') === -1) {
                        // 单张图片
                        galleryArray = [paramsObj.gallery];
                    } else {
                        // 多张图片（按分号分割并过滤空值）
                        galleryArray = paramsObj.gallery.split(';').filter(item => item.trim() !== '');
                    }

                    if (galleryArray.length > 0) {
                        const galleryData = galleryArray.map(image => ({
                            product_id: ID,
                            product_image: image
                        }));
                        await tx.mall_goods_gallery.createMany({
                            data: galleryData
                        });
                    }
                }

                return newProduct;
            });

            // 5. 返回成功响应
            res.status(200).json({
                success: true,
                message: '商品添加成功',
                data: {
                    product_id: ID,
                    product_title: result.product_title
                }
            });

        } catch (error) {
            console.error('商品提交失败:', error);

            // 6. 精确的错误处理
            let errorMessage = '服务器内部错误';
            let statusCode = 500;

            // 处理Prisma特定错误
            if (error.code === 'P2002') {
                errorMessage = '商品ID或关键信息重复';
                statusCode = 409;
            } else if (error.code === 'P2003') {
                errorMessage = '关联的品牌信息不存在';
                statusCode = 400 } else if (error.code === 'P2010') {
                errorMessage = '数据库连接失败';
                statusCode = 503;
            }

            res.status(statusCode).json({
                success: false,
                error: errorMessage,
                message: '商品添加失败'
            });
        } finally {
            // 7. 确保数据库连接被关闭
            await prisma.$disconnect();
        }
    });
};
