import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Rule } from 'webpack';

export const stylesRulesFactory = (
	extractCssPlugin: any,
	isProd: boolean,
	includePaths: string[] = ['./src/styles'],
): Rule[] => [{
	test: /\.s?css$/,
	use: [
		isProd ? MiniCssExtractPlugin.loader : { loader: 'style-loader', options: { sourceMap: true } }, // required for HMR
		{ loader: 'css-loader', options: { sourceMap: true, import: true } },
		{ loader: 'sass-loader', options: { sourceMap: true, includePaths } },
	],
}];
