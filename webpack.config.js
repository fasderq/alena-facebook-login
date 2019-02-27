const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

require('dotenv').config('.env');

// process.env.NODE_ENV = process.env.WEBPACK_MODE;
const isProduction = process.env.NODE_ENV === 'production';


module.exports = (env, args) => {
	let production = false;

	if (args && args.mode === 'production') {
		production = true;
		console.log('== Production mode');
	} else {
		console.log('== Development mode');
	}

	return {
		entry: {
			main: './src/bootstrap.tsx'
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/dist'
		},
		target: 'web',
		devtool: production ? false : 'source-map',
		// optimization: {
		// 	splitChunks: {
		// 		cacheGroups: {
		// 			vendor: {
		// 				test: /[\\/]node_modules[\\/]/,
		// 				name: 'js/vendor',
		// 				chunks: 'initial',
		// 				enforce: true,
		// 			},
		// 		},
		// 	},
		// },
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.html', '.txt'],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					}],
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [

						{
							loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
						}, {
							loader: "css-loader"
						}, {
							loader: "sass-loader"
						}
					]
				},
				{
					test: /\.(png|jpg|gif)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'file-loader',
							options: {
								limit: 10000,
								name: '[path][name].[ext]?[hash:base64:5]'
							}
						}]
				},

			],
		},
		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			contentBase: './dist',
			compress: true,
			port: 3030,
			https: true
		},
		plugins: [
			new webpack.DefinePlugin({
				'PRODUCTION': JSON.stringify(isProduction)
			}),
			new HtmlWebpackPlugin({
				template: './src/static/index.html'
			}),
			new ForkTsCheckerWebpackPlugin(),
			// new CopyWebpackPlugin([
			// 	// static files to the site root folder (index and robots)
			// 	{
			// 		from: './src/static/**/*',
			// 		to: path.resolve('./dist/'),
			// 		toType: 'dir',
			// 		flatten: true
			// 	},
			// ]),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css'
			})
		],
	};
};