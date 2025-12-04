const express = require('express')
const {currentFileName} = require("../../util/util");
const router = express.Router()

module.exports = (app, prisma) => {

    router.get('/statisticsData', async (req, res) => {
        try {
            // 使用 Promise.all 并行执行所有独立查询
            const [
                userConsumptionData,
                productSalesData,
                keywordData,
                basicStats,
                productTypeSales,
                videoStats
            ] = await Promise.all([
                getUserConsumptionStats(),
                getProductSalesStats(),
                getKeywordStats(),
                getBasicStatistics(),
                getProductTypeSalesChart(),
                getVideoStatistics()
            ]);

            const result = {
                userConsumption: userConsumptionData,
                productSales: productSalesData,
                keywords: keywordData,
                 ...basicStats,
                salesChart: productTypeSales,
                videoStats: videoStats // 新增视频统计结果
            };


            res.json({
                success: true,
                data: result,
                message: '统计数据获取成功',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error(`${currentFileName(__filename)}获取统计数据失败:`, error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '获取统计数据失败'
            });
        }
    });

    // 1. 用户消费统计 - 根据您的模型优化
    async function getUserConsumptionStats() {
        try {
            // 使用 groupBy 按 user_id 分组统计，注意这里使用 mall_user 的 user_id 而非 id
            const userStats = await prisma.mall_store_order.groupBy({
                by: ['user_id'],
                where: {
                    payment_status: 2 // 假设2表示已支付
                },
                _sum: {
                    total_price: true
                },
                _count: {
                    id: true // 统计订单数
                },
                orderBy: {
                    _sum: {
                        total_price: 'desc'
                    }
                }
            });

            // 提取有效的用户ID（过滤null值）
            const userIds = userStats.filter(stat => stat.user_id !== null).map(stat => stat.user_id);

            if (userIds.length === 0) {
                return [];
            }

            // 批量查询用户信息
            const users = await prisma.mall_user.findMany({
                where: {
                    user_id: {
                        in: userIds
                    }
                },
                select: {
                    user_id: true,
                    username: true,
                    account: true
                }
            });

            // 构建用户映射
            const userMap = new Map();
            users.forEach(user => {
                userMap.set(user.user_id, user);
            });

            // 组合数据
            return userStats.filter(stat => stat.user_id !== null).map(stat => {
                const userInfo = userMap.get(stat.user_id) || {};
                return {
                    user_id: stat.user_id.toString(),
                    username: userInfo.username || '未知用户',
                    account: userInfo.account || '',
                    totalConsumption: stat._sum.total_price || 0,
                    orderCount: stat._count.id
                };
            });
        } catch (error) {
            console.error('用户消费统计失败:', error);
            return [];
        }
    }

    // 2. 商品销量统计 - 根据 mall_goods 模型优化
    async function getProductSalesStats() {
        try {
            // 使用商品类型的分组统计
            const salesByType = await prisma.mall_goods.groupBy({
                by: ['product_type'],
                _sum: {
                    sales: true,
                    price: true
                },
                _avg: {
                    price: true
                },
                _count: {
                    id: true
                },
                orderBy: {
                    _sum: {
                        sales: 'desc'
                    }
                }
            });
            return salesByType.map(item => ({
                type: item.product_type,
                sales: item._sum.sales || 0,
                productCount: item._count.id || 0,
                totalRevenue: (item._sum.sales || 0) * (item._avg.price || 0),
                avgPrice: item._avg.price || 0
            }));
        } catch (error) {
            console.error('商品销量统计失败:', error);
            return [];
        }
    }

    // 3. 搜索关键词统计 - 根据 mall_user_search_word 模型
    async function getKeywordStats() {
        try {
            return await prisma.mall_user_search_word.findMany({
                select: {
                    word: true,
                    search_count: true
                },
                orderBy: {
                    search_count: 'desc'
                },
                take: 20 // 返回前20个热门搜索词
            });
        } catch (error) {
            console.error('搜索关键词统计失败:', error);
            return [];
        }
    }

    // 4. 基础统计数据查询
    async function getBasicStatistics() {
        try {
            const [
                totalUserCount,
                totalGoodsCount,
                visitorData,
                notFinishOrderCount,
                finishedOrderCount,
                totalVideosCount
            ] = await Promise.all([
                // 用户总数
                prisma.mall_user.count(),
                // 商品总数
                prisma.mall_goods.count(),
                // 访客数据
                getVisitorStats(),
                // 未完成订单数（根据您的业务逻辑调整状态码）
                prisma.mall_store_order.count({
                    where: {
                        OR: [
                            { payment_status: 0 },
                            { payment_status: 1 },
                            { payment_status: 4 }
                        ]
                    }
                }),
                // 已完成订单数
                prisma.mall_store_order.count({
                    where: {
                        payment_status: 2 // 假设2表示已完成
                    }
                }),
                // 视频总数
                prisma.mall_video.count()
            ]);

            return {
                total_user: totalUserCount,
                total_goods: totalGoodsCount,
                visitor: visitorData,
                order_not_finish: notFinishOrderCount,
                order_finished: finishedOrderCount,
                total_videos: totalVideosCount
            };
        } catch (error) {
            console.error('基础统计查询失败:', error);
            return {
                total_user: 0,
                total_goods: 0,
                visitor: [],
                order_not_finish: 0,
                order_finished: 0,
                total_videos: 0
            };
        }
    }

    // 访客统计数据查询
    async function getVisitorStats() {
        try {
            // 获取最近30天的访客数据
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return await prisma.mall_visitor.findMany({
                where: {
                    time: {
                        gte: new Date(thirtyDaysAgo) // 适配您的字符串日期格式
                    }
                },
                select: {
                    count: true,
                    time: true
                },
                orderBy: {
                    time: 'desc'
                },
                take: 30
            });
        } catch (error) {
            console.error('访客统计失败:', error);
            return [];
        }
    }

    // 5. 商品类型销售图表数据
    async function getProductTypeSalesChart() {
        try {
            const salesData = await prisma.mall_goods.groupBy({
                by: ['product_type'],
                _sum: {
                    sales: true
                },
                orderBy: {
                    _sum: {
                        sales: 'desc'
                    }
                },
                take: 10 // 只返回前10个类型
            });

            return salesData.map(item => ({
                name: item.product_type,
                value: item._sum.sales || 0
            }));
        } catch (error) {
            console.error('商品类型销售统计失败:', error);
            return [];
        }
    }

    // 6. 新增：视频统计数据
    async function getVideoStatistics() {
        try {
            const [totalVideos, recentVideos] = await Promise.all([
                prisma.mall_video.count(),
                prisma.mall_video.findMany({
                    take: 10,
                    orderBy: {
                        last_modified: 'desc'
                    },
                    select: {
                        uid: true,
                        title: true,
                        name: true,
                        upload_time: true,
                        last_modified: true
                    }
                })
            ]);

            recentVideos?.map((item)=>{
                item.uid = item.uid.toString();
                item.last_modified = item.last_modified.toString();
                return item
            })

            return {
                total_count: totalVideos,
                recent_videos: recentVideos
            };
        } catch (error) {
            console.error('视频统计失败:', error);
            return {
                total_count: 0,
                recent_videos: []
            };
        }
    }

    // 新增API：按时间范围统计
    router.get('/statisticsData/range', async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    error: '请提供开始日期和结束日期'
                });
            }

            const [ordersInRange, usersInRange] = await Promise.all([
                // 时间范围内的订单统计
                prisma.mall_store_order.aggregate({
                    where: {
                        // 注意：您的模型中没有created_at字段，需要根据实际字段调整
                        // 这里假设有创建时间字段，您可能需要添加或使用其他字段
                    },
                    _count: { id: true },
                    _sum: { total_price: true }
                }),
                // 时间范围内注册的用户统计
                prisma.mall_user.count({
                    where: {
                        register_time: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                })
            ]);

            res.json({
                success: true,
                data: {
                    order_count: ordersInRange._count.id,
                    total_revenue: ordersInRange._sum.total_price,
                    new_users: usersInRange
                },
                message: '时间范围统计获取成功'
            });

        } catch (error) {
            console.error('时间范围统计失败:', error);
            res.status(500).json({
                success: false,
                error: '时间范围统计失败'
            });
        }
    });

    // 新增API：实时数据看板
    router.get('/dashboard', async (req, res) => {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const [
                todayOrders,
                yesterdayOrders,
                popularProducts,
                activeUsers
            ] = await Promise.all([
                // 今日订单（需要根据实际时间字段调整）
                prisma.mall_store_order.count({
                    where: {
                        // 时间条件需要根据您的模型调整
                    }
                }),
                // 昨日订单
                prisma.mall_store_order.count({
                    where: {
                        // 时间条件
                    }
                }),
                // 热销商品
                prisma.mall_goods.findMany({
                    take: 5,
                    orderBy: { sales: 'desc' },
                    select: {
                        product_title: true,
                        sales: true,
                        price: true
                    }
                }),
                // 活跃用户（最近有订单的用户）
                prisma.mall_user.count({
                    where: {
                        // 需要关联订单表判断活跃度
                    }
                })
            ]);

            res.json({
                success: true,
                data: {
                    today_orders: todayOrders,
                    order_growth: yesterdayOrders > 0 ?
                        ((todayOrders - yesterdayOrders) / yesterdayOrders * 100) : 0,
                    popular_products: popularProducts,
                    active_users: activeUsers
                }
            });

        } catch (error) {
            console.error('看板数据获取失败:', error);
            res.status(500).json({
                success: false,
                error: '看板数据获取失败'
            });
        }
    });

    app.use('/admin', router);
};
