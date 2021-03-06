const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: ['./src/index.js', './src/sass/main.scss'],
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
						},
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							implementation: require('sass'),
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'file-loader',
				options: {
					outputPath: 'assets/fonts',
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '/css/main.css',
		}),
	],
};
