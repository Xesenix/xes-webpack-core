import { Rule } from 'webpack';

export const markdownRulesFactory = (): Rule[] => [{
	test: /\.md$/,
	use: [
		{	loader: 'html-loader', },
		{	loader: 'markdown-loader', },
	],
}];
