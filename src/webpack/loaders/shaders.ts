import { Rule } from 'webpack';

export default (): Rule[]  => [
	{ test: /\.(glsl|frag|vert)$/, loader: 'raw-loader' },
	{ test: /\.(glsl|frag|vert)$/, loader: 'glslify' },
];
