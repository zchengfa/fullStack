const express = require("express");
const { getIntervalDays } = require('../../util/timeFormatting')
const {cache} = require("express/lib/application");

module.exports = (app, prisma) => {
    const router = express.Router()

    // Express 4.16+ 已内置 body-parser 功能，无需单独引入
    // 使用 express.json() 替代 body-parser

    // 获取所有优惠券（带分页和筛选）
    router.get('/preferential', async (req, res) => {
        try {
            const {
                page = 1,
                pageSize = 10,
                status,
                type,
                search
            } = req.query;

            const skip = (parseInt(page) - 1) * parseInt(pageSize);
            const take = parseInt(pageSize);

            // 构建查询条件
            const whereCondition = {};

            if (status !== undefined) {
                whereCondition.release_status = status === 'true' || status === '1';
            }

            if (type) {
                whereCondition.type = type;
            }

            if (search) {
                whereCondition.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { type: { contains: search, mode: 'insensitive' } }
                ];
            }

            // 并行查询数据和总数
            const [preferentials, totalCount] = await Promise.all([
                prisma.mall_preferential.findMany({
                    where: whereCondition,
                    select: {
                        id: true,
                        name: true,
                        use_threshold: true,
                        stock: true,
                        expiration_time: true,
                        type: true,
                        release_status: true,
                        created_at: true,
                        updated_at: true
                    },
                    orderBy: { created_at: 'desc' },
                    skip,
                    take
                }),
                prisma.mall_preferential.count({ where: whereCondition })
            ]);

            res.json({
                success: true,
                data: {
                    preferentials,
                    pagination: {
                        page: parseInt(page),
                        pageSize: parseInt(pageSize),
                        total:totalCount,
                        totalPages: Math.ceil(totalCount / parseInt(pageSize))
                    }
                },
                message: '获取优惠券列表成功'
            });

        } catch (error) {
            console.error('获取优惠券列表失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '获取优惠券列表失败'
            });
        }
    });

    // 发布/撤回优惠券
    router.post('/releasePreferential', async (req, res) => {
        try {
            const { id, status } = req.body;

            // 参数验证
            if (id === undefined || status === undefined) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要参数: id 或 status'
                });
            }

            //检查优惠券是否存在
            const existingPreferential = await prisma.mall_preferential.findUnique({
                where: { id: parseInt(id) }
            });

            if (!existingPreferential) {
                return res.status(404).json({
                    success: false,
                    error: '未找到对应的优惠券'
                });
            }

            // 更新发布状态
            const updatedPreferential = await prisma.mall_preferential.update({
                where: { id: parseInt(id) },
                data: {
                    release_status: Number(Boolean(status)),
                    updated_at: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    release_status: true,
                    updated_at: true
                }
            });

            res.json({
                success: true,
                data: updatedPreferential,
                message: status ? '优惠券发布成功' : '优惠券已撤回'
            });

        }
        catch(error) {
            console.error('更新优惠券状态失败:', error);

            // 处理 Prisma 特定错误
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: '未找到对应的优惠券记录'
                });
            }

            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '更新优惠券状态失败'
            });
        }
    });

    // 添加优惠券
    router.post('/addPreferential', async (req, res) => {
        try {
            const { formData } = req.body;

            // 参数验证
            if (!formData) {
                return res.status(400).json({
                    success: false,
                    error: '缺少表单数据'
                });
            }

            const { name, threshold, count, expired, type } = formData;

            // 必填字段验证
            if (!name || !threshold || !count || !expired || !type) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要的优惠券信息'
                });
            }

            // 计算过期时间
            const now = new Date();
            const expiredDate = new Date(expired);
            const expiration_time = getIntervalDays(now, expiredDate);

            // 验证过期时间
            if (expiration_time <= 0) {
                return res.status(400).json({
                    success: false,
                    error: '过期时间必须大于当前时间'
                });
            }

            // 创建优惠券
            const newPreferential = await prisma.mall_preferential.create({
                data: {
                    name: name.trim(),
                    use_threshold: parseInt(threshold),
                    stock: parseInt(count),
                    expiration_time: expiration_time,
                    type: type,
                    release_status: false, // 默认不发布
                    created_at: now,
                    updated_at: now
                },
                select: {
                    id: true,
                    name: true,
                    use_threshold: true,
                    stock: true,
                    expiration_time: true,
                    type: true,
                    release_status: true,
                    created_at: true
                }
            });

            res.status(201).json({
                success: true,
                data: newPreferential,
                message: '优惠券添加成功'
            });

        } catch (error) {
            console.error('添加优惠券失败:', error);

            // 处理唯一约束错误
            if (error.code === 'P2002') {
                return res.status(400).json({
                    success: false,
                    error: '优惠券名称已存在'
                });
            }

            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '添加优惠券失败'
            });
        }
    });

    // 更新优惠券信息（新增功能）
    router.put('/updatePreferential/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { formData } = req.body;

            if (!formData) {
                return res.status(400).json({
                    success: false,
                    error: '缺少更新数据'
                });
            }

            // 检查优惠券是否存在
            const existingPreferential = await prisma.mall_preferential.findUnique({
                where: { id: parseInt(id) }
            });

            if (!existingPreferential) {
                return res.status(404).json({
                    success: false,
                    error: '未找到对应的优惠券'
                });
            }

            const updateData = {};

            // 只更新提供的字段
            if (formData.name !== undefined) updateData.name = formData.name;
            if (formData.threshold !== undefined) updateData.use_threshold = parseInt(formData.threshold);
            if (formData.count !== undefined) updateData.stock = parseInt(formData.count);
            if (formData.type !== undefined) updateData.type = formData.type;

            // 处理过期时间更新
            if (formData.expired) {
                const now = new Date();
                const expiredDate = new Date(formData.expired);
                const expiration_time = getIntervalDays(now, expiredDate);

                if (expiration_time <= 0) {
                    return res.status(400).json({
                        success: false,
                        error: '过期时间必须大于当前时间'
                    });
                }
                updateData.expiration_time = expiration_time;
            }

            updateData.updated_at = new Date();

            const updatedPreferential = await prisma.mall_preferential.update({
                where: { id: parseInt(id) },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    use_threshold: true,
                    stock: true,
                    expiration_time: true,
                    type: true,
                    release_status: true,
                    updated_at: true
                }
            });

            res.json({
                success: true,
                data: updatedPreferential,
                message: '优惠券更新成功'
            });

        } catch (error) {
            console.error('更新优惠券失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '更新优惠券失败'
            });
        }
    });

    // 删除优惠券（新增功能）
    router.delete('/deletePreferential/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // 检查优惠券是否存在
            const existingPreferential = await prisma.mall_preferential.findUnique({
                where: { id: parseInt(id) }
            });

            if (!existingPreferential) {
                return res.status(404).json({
                    success: false,
                    error: '未找到对应的优惠券'
                });
            }

            await prisma.mall_preferential.delete({
                where: { id: parseInt(id) }
            });

            res.json({
                success: true,
                message: '优惠券删除成功'
            });

        } catch (error) {
            console.error('删除优惠券失败:', error);

            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: '优惠券不存在'
                });
            }

            res.status(500).json({
                success: false,
                error: '服务器内部错误',
                message: '删除优惠券失败'
            });
        }
    });

    app.use('/admin', router);
}
