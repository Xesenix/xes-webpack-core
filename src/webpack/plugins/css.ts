import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const cssPluginFactory = (isProd: boolean, config: any = {}) => new MiniCssExtractPlugin({
	filename: isProd ? 'css/[name].[hash].css' : 'css/[name].css',
	...config,
});
