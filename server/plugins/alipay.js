//引入alipay-sdk依赖包
const AlipaySdk = require('alipay-sdk').default

const alipaySdk = new AlipaySdk({
  //appId
  appId:process.env.ALIPAY_APP_ID,

  //签名算法
  signType:process.env.ALIPAY_SIGN_TYPE,

  //支付宝网关
  gateway:process.env.ALIPAY_GATEWAY,

  //支付宝公钥
  alipayPublicKey:process.env.ALIPAY_PUBLIC_KEY,
  //应用私钥
  privateKey:process.env.ALIPAY_PRIVATE_KEY,
})

module.exports = alipaySdk
