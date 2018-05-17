let webpack = require('webpack')
	, glob = require('glob')
	, path = require('path')
	, CleanPlugin = require('clean-webpack-plugin')
	, ExtractPlugin = require('extract-text-webpack-plugin')

let config = {}
	, dirPath = __dirname
	, PRO = process.env.NODE_ENV === 'production'

function getEntry( globPath, str ){
    var files = glob.sync( globPath )
        , entries = {}
        , entry
        , key;
    for (var i = 0; i < files.length; i++) {
        entry = files[i]
        key = entry.replace('./js/', '').replace('.js', '') + (str || '')
        entries[key] = [ entry ]
    }
   return entries
}

config.entry = getEntry('./js/*.js')

config.output = {
	path: dirPath + '/dist'
	, publicPath: '/dist/'
	, filename: 'js/[name].js'
	, chunkFilename: 'js/[name].js'
	, libraryTarget: 'umd'
}

// 配置 webpack 插件
config.plugins = [
	new ExtractPlugin( {
			filename: 'css/[name].css'
			, allChunks: true
		} )
]

config.module = {}
// 将jquery作为全局变量
config.module.loaders = [
	{
		test: require.resolve('jquery')
		, loader: 'expose-loader?jQuery!expose-loader?$'
	}
]

config.resolve = {
	modules: [path.resolve(dirPath, 'node_modules')]
	, alias: {
		// 'jquery': 'jquery/dist/jquery.min.js'
		// 'jquery-migrate': 'jquery-migrate/dist/jquery-migrate.min.js'
	}
}

// es6 格式转换
config.module.loaders = config.module.loaders.concat([
							{
								test: /\.(js|jsx)$/i
								, include: path.resolve(dirPath, 'js')
								, exclude: /node_modules/
								, loader: 'babel-loader?cacheDirectory'
								, query: {
									compact: false
									, presets: ['es2015', 'react', 'stage-0']
								}
							}
						])


// 压缩css
let miniCSS = false
// 生产配置
if( PRO ){
	miniCSS = true

	config.entry = getEntry('./js/*.js', '.min')

	config.plugins = config.plugins.concat([
						new webpack.optimize.UglifyJsPlugin({
							compress: {
								warnings: false
							}
							, sourceMap: true
						})
						, new webpack.DefinePlugin({
							'process.env': {
								NODE_ENV: JSON.stringify('production')
							}
						})
					])
}else{
	config.plugins = config.plugins.concat([
					new CleanPlugin(['./dist'])
				])
}

// scss
config.module.loaders = config.module.loaders.concat([
							{
								test: /\.(scss|css)$/
								, use: ExtractPlugin.extract({
									use:[
										{
											loader: 'css-loader'
											, options:{
												modules: false
												, importLoaders: 1
												, localIdentName: '[local]' // _[hash:base64:5]
												, sourceMap: true
												, minimize: miniCSS
											}
										}
										, 'postcss-loader'
										, {
											loader: 'sass-loader'
											, options:{
												sourceMap: true
												, minimize: miniCSS
											}
										}
									]
									, fallback: 'style-loader'
								})
							}
							, { 
								test: /\.(eot|woff|woff2|ttf|svg|otf)$/
								, loader: 'file-loader' 
								, options: {
									publicPath: '../'
									, name: 'fonts/[name].[ext]'
								}
							}
						])

module.exports = config