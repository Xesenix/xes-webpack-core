import { Rule } from 'webpack';

export const shaderRulesFactory = (): Rule[] => [
	{ test: /\.(glsl|frag|vert)$/, loader: 'raw-loader' },
	{ test: /\.(glsl|frag|vert)$/, loader: 'glslify' },
];
