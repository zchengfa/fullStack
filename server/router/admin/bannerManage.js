const express = require('express')
const {currentFileName} = require("../../util/util");
const router = express.Router()

module.exports = (app, prisma) => {

  // 获取所有banner
  router.post('/banner', async (req, res) => {
    try {
      const banners = await prisma.mall_banner.findMany({
        select: {
          id: true,
          isShow: true,
          brand_id: true,
          image_url: true,
          created_at: true
        },
        orderBy: {
          created_at: 'desc' // 按创建时间倒序排列
        }
      })
      banners.map(banner => {
        banner.brand_id = banner.brand_id.toString()
        return banner
      })
      res.status(200).json({
        success: true,
        data: banners,
        message: '获取banner列表成功'
      })
    } catch (error) {
      console.error(`${currentFileName(__filename)}获取banner列表失败:`, error)
      res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: '获取banner列表失败'
      })
    }
  })

  // 操作banner显示状态
  router.post('/operationBanner', async (req, res) => {
    try {
      const { id, isShow } = req.body

      // 参数验证
      if (!id) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数: id'
        })
      }

      // 转换并验证isShow参数
      const isShowBoolean = Boolean(Number(isShow))
      const newShowStatus = !isShowBoolean // 切换状态

      // 使用Prisma更新记录
      const updatedBanner = await prisma.mall_banner.update({
        where: {
          id: Number(id)
        },
        data: {
          isShow: newShowStatus ? 1 : 0
        },
        select: {
          id: true,
          isShow: true,
          brand_id: true
        }
      })

      res.status(200).json({
        success: true,
        data: {
          banner: updatedBanner,
          operation_responsive: newShowStatus ? 1 : 0
        },
        message: `banner显示状态已${newShowStatus ? '开启' : '关闭'}`
      })

    } catch (error) {
      console.error(`${currentFileName(__filename)}操作banner失败:`, error)

      // 处理Prisma特定错误
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: '未找到对应的banner记录'
        })
      }

      res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: '操作banner失败'
      })
    }
  })

  // 批量操作banner状态
  router.post('/batchOperationBanner', async (req, res) => {
    try {
      const { ids, isShow } = req.body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return(400).json({
          success: false,
          error: '缺少有效的banner ID数组'
        })
      }

      const result = await prisma.mall_banner.updateMany({
        where: {
          id: { in: ids.map(id => Number(id)) }
        },
        data: {
          isShow: isShow ? 1 : 0
        }
      })

      res.status(200).json({
        success: true,
        data: {
          updatedCount: result.count
        },
        message: `成功更新 ${result.count} 个banner的状态`
      })

    } catch (error) {
      console.error(`${currentFileName(__filename)}批量操作banner失败:`, error)
      res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: '批量操作b'
      })
    }
  })

  // 获取特定状态的banner
  router.post('/bannerByStatus', async (req, res) => {
    try {
      const { isShow } = req.body
      const showStatus = isShow !== undefined ? Boolean(Number(isShow)) : undefined

      const banners = await prisma.mall_banner.findMany({
        where: showStatus !== undefined ? { isShow: showStatus ? 1 : 0 } : {},
        select: {
          id: true,
          isShow: true,
          brand_id: true,
          image_url: true,
          title: true,
          created_at: true
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      res.status(200).json({
        success: true,
        data: banners,
        message: `获取${showStatus !== undefined ? (showStatus ? '显示' : '隐藏') : '全部'}banner成功`
      })

    } catch (error) {
      console.error(`${currentFileName(__filename)}按状态获取banner失败:`, error)
      res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: '按状态获取banner失败'
      })
    }
  })

  app.use('/admin', router)
}
