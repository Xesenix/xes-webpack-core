import { Rule } from 'webpack';

export const babelRulesFactory = (): Rule[] => [{
	test: /\.(t|j)sx?$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: 'babel-loader',
	},
}];
