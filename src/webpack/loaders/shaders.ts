import { RuleSetRule } from 'webpack';

export const shaderRulesFactory = (): RuleSetRule[] => [
	{ test: /\.(glsl|frag|vert)$/, loader: 'raw-loader' },
	{ test: /\.(glsl|frag|vert)$/, loader: 'glslify' },
];
