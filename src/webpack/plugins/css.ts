import ExtractTextPlugin from 'extract-text-webpack-plugin';

export const cssPluginFactory = (config: any = {}) => new ExtractTextPlugin({
	filename: 'css/[name].css',
	...config,
});
