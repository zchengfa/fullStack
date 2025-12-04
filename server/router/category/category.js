module.exports = (app,prisma)=>{
    const express = require('express')
    const router = express.Router()
    router.get('/category_list', async (req, res) => {
        try {
            const categories = await prisma.categoryList.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    coverImage: true,
                    sortOrder: true,
                    isActive: true,
                    _count: {
                        select: { details: true } // 统计分类下的商品数量
                    }
                },
                where: {
                    isActive: true // 只返回激活的分类
                },
                orderBy: [
                    { sortOrder: 'asc' },
                    { createdAt: 'desc' }
                ]
            });

            res.json({
                success: true,
                data: categories,
                message: '分类列表获取成功'
            });

        } catch (error) {
            console.error('获取分类列表失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '获取分类列表失败'
            });
        }
    });

// 获取分类详情 - 优化后
    router.get('/category_detail', async (req, res) => {
        try {
            const { categoryId, page = 1, pageSize = 10, sortBy = 'sales' } = req.query;

            if (!categoryId) {
                return res.status(400).json({
                    success: false,
                    error: '缺少分类ID参数'
                });
            }

            const skip = (parseInt(page) - 1) * parseInt(pageSize);

            // 构建排序条件
            const orderBy = {};
            const validSortFields = ['sales', 'rating', 'price', 'createdAt'];
            if (validSortFields.includes(sortBy)) {
                orderBy[sortBy] = 'desc';
            } else {
                orderBy.sales = 'desc'; // 默认按销量排序
            }

            const [details, totalCount, categoryInfo] = await Promise.all([
                // 查询商品详情
                prisma.categoryDetail.findMany({
                    where: {
                        categoryId: categoryId,
                        isInStock: true // 只显示有库存的商品
                    },
                    select: {
                        id: true,
                        productName: true,
                        productImage: true,
                        price: true,
                        originalPrice: true,
                        sales: true,
                        rating: true,
                        tags: true,
                        description: true,
                        isInStock: true
                    },
                    orderBy: orderBy,
                    skip: skip,
                    take: parseInt(pageSize)
                }),
                // 统计总数
                prisma.categoryDetail.count({
                    where: {
                        categoryId: categoryId,
                        isInStock: true
                    }
                }),
                // 获取分类信息
                prisma.categoryList.findUnique({
                    where: { id: categoryId },
                    select: { name: true, description: true }
                })
            ]);

            if (!categoryInfo) {
                return res.status(404).json({
                    success: false,
                    error: '分类不存在',
                    message: '未找到指定的分类'
                });
            }

            res.json({
                success: true,
                data: {
                    category: categoryInfo,
                    products: details,
                    pagination: {
                        page: parseInt(page),
                        pageSize: parseInt(pageSize),
                        total: totalCount,
                        totalPages: Math.ceil(totalCount / parseInt(pageSize))
                    }
                },
                message: '分类详情获取成功'
            });

        } catch (error) {
            console.error('获取分类详情失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '获取分类详情失败'
            });
        }
    })

    app.use('/home/api', router)
}
