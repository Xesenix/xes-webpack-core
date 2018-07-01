import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';

/**
 * Requires MiniCssExtractPlugin in webpack plugins on production.
 * @param includePaths paths used to resolve @imports in sass files
 * @param hmr decides if method should generate production setup
 */
export const stylesRulesFactory = (
	includePaths: string[] = ['./src/styles'],
	hmr: boolean = false,
): RuleSetRule[] => [{
	test: /\.s?css$/,
	use: [
		!hmr ? MiniCssExtractPlugin.loader : { loader: 'style-loader', options: { sourceMap: true } }, // required for HMR
		{ loader: 'css-loader', options: { sourceMap: true, import: true } },
		{ loader: 'sass-loader', options: { sourceMap: true, includePaths } },
	],
}];
