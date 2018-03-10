import { Rule } from 'webpack';

export const translationRulesFactory = (): Rule[] => [{
	test: /\.po$/,
	exclude: /(node_modules|bower_components)/,
	use: [{ loader: 'json-loader' }, { loader: 'po-gettext-loader' }],
}];
