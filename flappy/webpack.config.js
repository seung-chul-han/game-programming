const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/flappy-bird.js',
	output: {
		filename: '[name].bundle.js',
		path: resolve(__dirname, 'dist'),
		clean: true,
	},
	devServer: {
		static: './dist',
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Flappy Bird',
			filename: 'index.html',
			template: './src/index.html',
		}),
	],
	optimization: {
		runtimeChunk: 'single',
	},
};
