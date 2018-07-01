import { RuleSetRule } from 'webpack';

export const markdownRulesFactory = (): RuleSetRule[] => [{
	test: /\.md$/,
	use: [
		{	loader: 'html-loader', },
		{	loader: 'markdown-loader', },
	],
}];
