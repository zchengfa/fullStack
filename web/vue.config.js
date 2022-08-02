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
		},
		// rules:[
		// 	//图片压缩（性能优化）
		// 	{
		// 		test: /\.(gif|png|jpe?g|svg)$/i,
		// 		use:[
		// 			{
		// 				loader:'file-loader',
		// 				options:{
		// 					name:'[name].[hash:7].[ext]'
		// 				}
		// 			},
		// 			{
		// 				loader:'image-webpack-loader',
		// 				options: {
		// 					mozjpeg:{
		// 						progressive:true,
		// 						quality:50,
		// 					},
		// 					optipng:{
		// 						enabled:true
		// 					},
		// 					panquant:{
		// 						quality: [0.5,0.65],
		// 						speed:4
		// 					},
		// 					gifsicle:{
		// 						interlaced:false
		// 					},
		// 					webp:{
		// 						quality:75
		// 					}
		// 				}
		// 			}
		// 		]
		// 	}
		//]
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