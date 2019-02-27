const webpack = require('webpack');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanCSSPlugin = require('less-plugin-clean-css');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = (process.env.NODE_ENV === 'production');


module.exports = (env, args) => {
	let production = false;

	if (args && args.mode === 'production') {
		production = true;
		console.log('== Production mode');
	} else {
		console.log('== Development mode');
	}

	// const lessLoader = production
	// 	? {
	// 		loader: 'less-loader',
	// 		options: {
	// 			plugins: [
	// 				new CleanCSSPlugin({advanced: true})
	// 			]
	// 		}
	// 	}
	// 	: {
	// 		loader: 'less-loader',
	// 	};

	return {
		entry: {
			'scripts/main': './src/bootstrap.tsx',
		},
		output: {
			path: path.resolve('./dist'),
		},
		target: 'web',
		devtool: production ? false : 'source-map',
		optimization: {
			splitChunks: {
				// always create vendor.js
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'scripts/vendor',
						chunks: 'initial',
						enforce: true,
					},
				},
			},
		},
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
				// app main .less file
				// {
				// 	test: /app\.less$/i,
				// 	use: [
				// 		{
				// 			loader: 'file-loader',
				// 			options: {
				// 				name: 'styles/app/[name].css',
				// 			}

				// 		},
				// 		lessLoader
				// 	]
				// },

				//sass loader

				{
					test: /app\.scss$/i,
					use: [
						// fallback to style-loader in development
						process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader"
					]
				},
				// {
				// 	test: /\.(png|jpg|gif)$/,
				// 	use: [
				// 		{
				// 			loader: 'file-loader',
				// 			options: {},
				// 		},
				// 	],
				// },
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
			new ForkTsCheckerWebpackPlugin(),
			new CopyWebpackPlugin([
				// static files to the site root folder (index and robots)
				{
					from: './src/static/**/*',
					to: path.resolve('./dist/'),
					toType: 'dir',
					flatten: true
				},
			]),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: 'app/[name].css',
				chunkFilename: 'app/[id].css'
			})
		],
	};
};