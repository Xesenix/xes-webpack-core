import { Rule } from 'webpack';

export const babelRulesFactory = (useBabelrc = false): Rule[] => [{
	test: /\.(t|j)sx?$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: 'babel-loader',
		options: useBabelrc ? {} : {
			compact: false,
			presets: [
				['@babel/preset-env', {
					targets: {
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
				require('babel-plugin-transform-decorators-legacy'),
				require('babel-plugin-transform-class-properties'),
				require('babel-plugin-transform-object-rest-spread'),
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
