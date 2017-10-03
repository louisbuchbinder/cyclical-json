const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const yearString = 2017 === (new Date).getFullYear() ? '2017' : '2017-' + (new Date).getFullYear();
const banner = `${pkg.name}-${pkg.version}
(c) ${pkg.author} ${yearString} ${pkg.license}`;

const entry = ['babel-polyfill/dist/polyfill.min.js'];
const entryNode = entry.slice().concat(['./index.js']);
const entryBrowser = entry.slice().concat(['./index.browser.js']);

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
		'cyclical-json': entryNode
	}
}, baseConfig);

serverConfig.output.libraryTarget = 'umd';

const clientConfig = Object.assign({
	target: 'web',
	entry: {
		'cyclical-json.browser': entryBrowser,
		'cyclical-json.browser.min': entryBrowser
	}
}, baseConfig);

module.exports = [
	serverConfig,
	clientConfig
];
