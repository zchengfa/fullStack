const express = require('express')
const {currentFileName} = require("../../util/util");
const router = express.Router()

module.exports = (app, prisma) => {

  router.post('/getOrderData', async (req, res) => {
    try {
      const ordersWithUsers = await prisma.mall_store_order.findMany({
        select: {
          order_id: true,
          payment_status: true,
          user_id: true,
          user: {  // 关联用户表
            select: {
              user_id: true,
              username: true,
              account: true
            }
          }
        },
        // 可以添加排序和分页
        orderBy: {
          order_id: 'desc'
        }
      });
      ordersWithUsers.map((item)=>{
        item.user_id = item.user_id.toString();
        item.user.user_id = item.user.user_id.toString();

        return item;
      })

      // 提取去重后的用户信息
      const uniqueUsersMap = new Map();
      ordersWithUsers.forEach(order => {
        if (order.user && !uniqueUsersMap.has(order.user.user_id)) {
          uniqueUsersMap.set(order.user.user_id.toString(), {
            user_id: order.user.user_id.toString(),
            username: order.user.username,
            account: order.user.account,
          })
        }
      });
      const uniqueUsers = Array.from(uniqueUsersMap.values());

      res.json({
        success: true,
        data: {
          order: ordersWithUsers,
          user_info: uniqueUsers
        },
        message: '获取订单数据成功',
        stats: {
          order_count: ordersWithUsers.length,
          user_count: uniqueUsers.length
        }
      });

    } catch (error) {
      console.error(`${currentFileName(__filename)}获取订单数据失败:`, error);

      // 处理 Prisma 特定错误
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: '未找到相关数据'
        });
      }

      res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: '获取订单数据失败'
      });
    }
  });

  app.use('/admin', router);
};
