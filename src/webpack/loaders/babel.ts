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
		options: {
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
				'@babel/preset-stage-3',
			],
			plugins: [
				require('babel-plugin-transform-decorators-legacy'),
				require('@babel/plugin-proposal-class-properties'),
				require('@babel/plugin-proposal-object-rest-spread'),
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
						'@babel/preset-stage-3',
					],
				},
			},
		},
	},
}];
