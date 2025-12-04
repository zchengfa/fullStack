const {currentFileName} = require("../../util/util");
module.exports = (app, prisma) => {
  const express = require('express')
  const router = express.Router()

  // 保存闪存时间
  router.post('/saveFlashTime', async (req, res) => {
    try {
      const { data } = req.body; // 直接解构，无需JSON.parse(JSON.stringify())

      // 参数验证
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({
          success: false,
          error: '缺少有效的数据数组'
        });
      }

      // 使用事务保证所有更新操作的原子性
      const results = await prisma.$transaction(
          data.map(item =>
              prisma.mall_goods.update({
                where: {
                  product_id: item.id.toString() // 确保类型一致
                },
                data: {
                  flash_sale_time: item.time
                }
              })
          )
      );

      res.json({
        success: true,
        message: `成功更新 ${results.length} 个商品的闪存时间`,
        data: {
          updatedCount: results.length
        }
      });

    } catch (error) {
      console.error('保存闪存时间失败:', error);

      // 处理 Prisma 特定错误
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: '未找到指定的商品记录'
        });
      }

      res.status(500).json({
        success: false,
        error: '服务器内部错误，保存闪存时间失败'
      });
    }
  });

  // 添加秒杀活动
  router.post('/addSeckill', async (req, res) => {
    try {
      const { data, time } = req.body;

      // 参数验证
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({
          success: false,
          error: '缺少有效的商品数据'
        });
      }

      if (!time) {
        return res.status(400).json({
          success: false,
          error: '缺少秒杀时间参数'
        });
      }

      //批量更新商品为秒杀状态
      const updatePromises = data.map(item =>
          prisma.mall_goods.update({
            where: {
              product_id: item.product_id.toString()
            },
            data: {
              preferential_type: '秒杀',
              flash_sale_time: time
            }
          })
      );

      const results = await Promise.allSettled(updatePromises);

      // 统计成功和失败的操作
      const successfulUpdates = results.filter(result => result.status === 'fulfilled').length;
      const failedUpdates = results.filter(result => result.status === 'rejected').length;

      // 如果有部分失败，记录详细信息
      const failedDetails = results
          .filter(result => result.status === 'rejected')
          .map((result, index) => ({
            index: index,
            product_id: data[index]?.product_id,
            error: result.reason.message
          }));

      res.json({
        success: true,
        message: `秒杀活动设置完成，成功: ${successfulUpdates} 个，失败: ${failedUpdates} 个`,
        data: {
          successfulCount: successfulUpdates,
          failedCount: failedUpdates,
          ...(failedUpdates > 0 && { failedDetails })
        }
      });

    } catch (error) {
      console.error('添加秒杀活动失败:', error);

      res.status(500).json({
        success: false,
        error: '服务器内部错误，添加秒杀活动失败'
      });
    }
  });

  // 移除秒杀活动
  router.post('/removeSeckill', async (req, res) => {
    try {
      const { id } = req.body;

      // 参数验证
      if (!id) {
        return res.status(400).json({
          success: false,
          error: '缺少商品ID参数'
        });
      }

      // 更新商品状态，移除秒杀标识
      const updatedProduct = await prisma.mall_goods.update({
        where: {
          product_id: id.toString()
        },
        data: {
          preferential_type: '', // 或设置为 null，根据数据库设计
          flash_sale_time: null  // 同时清空闪存时间
        },
        select: {
          product_id: true,
          preferential_type: true
        }
      });

      res.json({
        success: true,
        message: '成功移除商品秒杀活动',
        data: updatedProduct
      });

    } catch (error) {
      console.error('移除秒杀活动失败:', error);

      // 处理特定的 Prisma 错误
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: '未找到对应的商品记录'
        });
      }

      res.status(500).json({
        success: false,
        error: '服务器内部错误，移除秒杀活动失败'
      });
    }
  });

  // 批量移除秒杀活动（新增功能）
  router.post('/batchRemoveSeckill', async (req, res) => {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: '缺少有效的商品ID数组'
        });
      }

      // 使用 updateMany 进行批量更新
      const result = await prisma.mall_goods.updateMany({
        where: {
          product_id: {
            in: ids.map(id => id.toString())
          }
        },
        data: {
          preferential_type: '',
          flash_sale_time: null
        }
      });

      res.json({
        success: true,
        message: `成功移除 ${result.count} 个商品的秒杀活动`,
        data: {
          updatedCount: result.count
        }
      });

    } catch (error) {
      console.error(`${currentFileName(__filename)}批量移除秒杀活动失败:`, error);
      res.status(500).json({
        success: false,
        error: '批量移除秒杀活动失败'
      });
    }
  });

  app.use('/admin', router);
};
