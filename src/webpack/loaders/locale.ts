import { Rule } from 'webpack';

export default (): Rule[] => [{
	test: /\.po$/,
	exclude: /(node_modules|bower_components)/,
	use: [{ loader: 'json-loader' }, { loader: 'po-gettext-loader' }],
}];
