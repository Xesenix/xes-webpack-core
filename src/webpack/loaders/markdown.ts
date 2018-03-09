export default () => [{
	test: /\.md$/,
	use: [
		{	loader: 'html-loader', },
		{	loader: 'markdown-loader', },
	],
}];
