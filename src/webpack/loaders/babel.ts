import { Rule } from 'webpack';

export default (): Rule[]  => [{
	test: /\.(t|j)sx?$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: 'babel-loader',
	},
}];
