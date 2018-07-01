import { RuleSetRule } from 'webpack';

export const translationRulesFactory = (): RuleSetRule[] => [{
	test: /\.po$/,
	exclude: /(node_modules|bower_components)/,
	use: [{ loader: 'json-loader' }, { loader: 'po-gettext-loader' }],
}];
