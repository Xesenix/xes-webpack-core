import { RuleSetRule } from 'webpack';

/**
 * Builds configuration for loading source files with use of babel.
 * @param babelrc determines if we want to read configuration from .babelrc file
 */
export const babelRulesFactory = (babelrc = false): RuleSetRule[] => [{
	test: /\.(t|j)sx?$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: 'babel-loader',
		options: babelrc ? {
			babelrc,
			compact: false,
		} : {
			babelrc,
			compact: false,
			presets: [
				/**
				 * @see https://babeljs.io/docs/en/babel-preset-env
				 */
				['@babel/preset-env', {
					targets: {
						/**
						 * for more universal targeting use last 2 version or @see https://github.com/browserslist/browserslist#best-practices
						 */
						browsers: ['last 2 Chrome versions'],
					},
					loose: true,
					useBuiltIns: 'usage',
					modules: false,
					debug: true,
					spec: false,
				}],
				'@babel/preset-react',
				'@babel/preset-typescript',
			],
			plugins: [
				require('@babel/plugin-syntax-dynamic-import'),
				[require('@babel/plugin-syntax-decorators'), {
					legacy: true,
				}],
				require('@babel/plugin-syntax-object-rest-spread'),
			],
			env: {
				test: {
					presets: [
						['@babel/preset-env', {
							targets: {
								esmodules: true,
							},
							loose: true,
							modules: false,
							debug: true,
							spec: false,
						}],
						'@babel/preset-react',
						'@babel/preset-typescript',
					],
				},
			},
		},
	},
}];
