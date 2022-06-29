module.exports = {
	configureWebpack:{
		resolve:{
			alias:{
				'assets':'@/assets',
				'common':'@/common',
				'components':'@/components',
				'views':'@/views',
				'network':'@/network'
			}
		}
	},
	//关闭eslint检测
	lintOnSave:false,
	publicPath:'/',
	//设置代理解决跨域问题
	devServer:{
		proxy:{
			'/api':{
				target:'http://apis.juhe.cn/fapig/douyin',
				changeOrigin:true,
				pathRewrite:{
					'^/api':''
				}
			}
		}
	}


}