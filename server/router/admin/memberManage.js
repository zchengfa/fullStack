const express = require('express')
const router = express.Router()
const {currentFileName} = require("../../util/util");
module.exports = (app,prisma) => {


	router.get('/memberManage', async (req, res) => {
		try {
			// 1. 获取查询参数并设置默认值
			const page = parseInt(req.query.page) || 1;
			const pageSize = parseInt(req.query.pageSize) || 10;
			const search = req.query.search?.trim(); // 搜索关键词
			const sortBy = req.query.sortBy || 'register_time';
			const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

			// 2. 构建查询条件
			const whereCondition = search ? {
				OR: [
					{ username: { contains: search, mode: 'insensitive' } },
					{ display_name: { contains: search, mode: 'insensitive' } },
					{ email: { contains: search, mode: 'insensitive' } }
				]
			} : {};

			// 3. 并行执行查询：获取数据和总数
			const [users, totalCount] = await Promise.all([
				// 查询分页数据
				prisma.mall_user.findMany({
					select: {
						user_id: true,
						username: true,
						register_time: true,
						last_login_time: true,
						account: true,
						identity: true,
						gender: true,
					},
					orderBy: { [sortBy]: sortOrder },
					skip: (page - 1) * pageSize,
					take: pageSize,
				}),
				// 查询总数用于分页
				prisma.mall_user.count()
			]);

			// 4. 处理 BigInt 序列化问题（更优雅的方案）
			const serializedUsers = users.map(user => ({
				...user,
				user_id: user.user_id.toString(), // BigInt 转字符串
			}));

			// 5. 返回标准化的响应格式
			res.status(200).json({
				success: true,
				data: {
					users: serializedUsers,
					pagination: {
						page,
						pageSize,
						total: totalCount,
						totalPages: Math.ceil(totalCount / pageSize),
						hasNext: page * pageSize < totalCount,
						hasPrev: page > 1
					}
				},
				message: '获取成员列表成功'
			});

		} catch (error) {
			console.error(`${currentFileName(__filename)} 获取成员列表失败:`, error);

			// 6. 详细的错误处理
			let statusCode = 500;
			let errorMessage = '服务器内部错误';

			// 处理 Prisma 特有错误
			if (error.code === 'P1012') {
				statusCode = 400;
				errorMessage = '数据库模式验证失败';
			} else if (error.code === 'P1001') {
				statusCode = 503;
				errorMessage = '数据库连接超时';
			}

			res.status(statusCode).json({
				success: false,
				error: errorMessage,
				message: '获取成员列表失败',
				...(process.env.NODE_ENV === 'development' && {
					details: error.message
				})
			});
		}
	});

	router.post('/deleteUser', async (req, res) => {
		try {
			const { user_id } = req.body

			// 1. 参数验证
			if (!user_id) {
				return res.status(400).json({
					success: false,
					error: '缺少必要参数: user_id',
					message: '用户ID不能为空'
				})
			}

			// 2. 验证用户是否存在（可选，但推荐）
			const existingUser = await prisma.mall_user.findUnique({
				where: { user_id: user_id }
			})

			if (!existingUser) {
				return res.status(404).json({
					success: false,
					error: '用户不存在',
					message: `未找到ID为 ${user_id} 的用户`
				})
			}

			// 3. 执行删除操作
			const deletedUser = await prisma.mall_user.delete({
				where: { user_id: user_id },
				select: {
					user_id: true,
					username: true,
					email: true,
					created_at: true
					// 选择需要返回的字段
				}
			})

			// 4. 记录删除日志（可选）
			console.log(`${currentFileName(__filename)} 用户删除成功:`, {
				user_id: deletedUser.user_id,
				username: deletedUser.username,
				timestamp: new Date().toISOString()
			})

			// 5. 返回成功响应
			res.status(200).json({
				success: true,
				message: '用户删除成功',
				data: {
					deleted_user: deletedUser,
					deleted_at: new Date().toISOString()
				}
			})

		} catch (error) {
			console.error(`${currentFileName(__filename)} 删除用户失败:`, error)

			// 6. 详细的错误处理
			let statusCode = 500
			let errorMessage = '服务器内部错误'
			let errorDetails = null

			// 处理 Prisma 特定错误
			if (error.code === 'P2025') {
				statusCode = 404
				errorMessage = '要删除的用户不存在'
			} else if (error.code === 'P2003') {
				statusCode = 409
				errorMessage = '存在关联记录，无法删除用户'
				errorDetails = '请先删除该用户相关的所有关联数据'
			} else if (error.code === 'P2002') {
				statusCode = 400
				errorMessage = '数据验证错误'
			}

			// 7. 安全地返回错误信息
			res.status(statusCode).json({
				success: false,
				error: errorMessage,
				message: '用户删除失败',
				...(process.env.NODE_ENV === 'development' && {
					details: error.message,
					code: error.code
				})
			})
		}
	})
    app.use('/admin',router)
}
