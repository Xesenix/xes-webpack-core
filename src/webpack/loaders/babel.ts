import { Rule } from 'webpack';

export const babelRulesFactory = (): Rule[] => [{
	test: /\.(t|j)sx?$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: 'babel-loader',
		options: {
			'compact': false,
			'presets': [
				['@babel/preset-env', {
					'targets': {
						'browsers': ['last 2 Chrome versions']
					},
					'loose': true,
					'useBuiltIns': 'usage',
					'modules': false,
					'debug': true,
					'spec': false
				}],
				'@babel/preset-react',
				'@babel/preset-typescript'
			],
			'plugins': [
				require('babel-plugin-transform-decorators-legacy'),
				require('babel-plugin-transform-class-properties'),
			],
			'env': {
				'test': {
					'presets': [
						['@babel/preset-env', {
							'targets': {
								'esmodules': true
							},
							'loose': true,
							'modules': false,
							'debug': true,
							'spec': false
						}],
						'@babel/preset-react',
						'@babel/preset-typescript'
					]
				}
			}
		}
	},
}];
