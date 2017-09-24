const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const yearString = 2017 === (new Date).getFullYear() ? '2017' : '2017-' + (new Date).getFullYear();
const banner = `${pkg.name}-${pkg.version}
(c) ${pkg.author} ${yearString} ${pkg.license}`;

const baseConfig = {
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			test: /\.min\.js$/,
			minimize: true
		}),
		new webpack.BannerPlugin(banner)
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['env']
				}
			}
		]
	}
};

const serverConfig = Object.assign({
	target: 'node',
	entry: {
		'cyclical-json': './index.js'
	}
}, baseConfig);

serverConfig.output.libraryTarget = 'umd';

const clientConfig = Object.assign({
	target: 'web',
	entry: {
		'cyclical-json.browser': './index.browser.js',
		'cyclical-json.browser.min': './index.browser.js'
	}
}, baseConfig);

module.exports = [
	serverConfig,
	clientConfig
];
