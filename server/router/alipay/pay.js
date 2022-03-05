module.exports = app =>{
  const express = require('express')
  const router = express.Router()

  const alipaySdk = require('../../plugins/alipay')
  const AlipayFromData = require('alipay-sdk/lib/form').default

  app.use('/',router)
}