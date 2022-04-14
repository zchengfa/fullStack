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

}