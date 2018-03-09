import { Rule } from 'webpack';

export default (): Rule[]  => [{
	test: /\.md$/,
	use: [
		{	loader: 'html-loader', },
		{	loader: 'markdown-loader', },
	],
}];
