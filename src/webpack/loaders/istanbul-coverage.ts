import { Rule } from 'webpack';

export const istanbulCoverageFactory = (srcRoot: string): Rule[] => [{
	test: /\.(j|t)sx?$/,
	use: {
		loader: 'istanbul-instrumenter-loader',
		options: { esModules: true },
	},
	include: srcRoot,
	exclude: /\.spec\.(j|t)sx?$/,
	enforce: 'post', // important to apply after its ready
}];
