import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
// import graph from 'rollup-plugin-graph';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
const camelCase = require('lodash.camelcase');

const pkg = require('./package.json');

const libraryName = 'xes-webpack-core';

export default {
	input: `src/${libraryName}.ts`,
	output: [
		{ file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true, },
		{ file: pkg.module, format: 'es', sourcemap: true, },
	],
	// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
	external: [
		'webpack',
		'html-webpack-plugin',
		'uglifyjs-webpack-plugin',
		'dotenv-webpack',
		'clean-webpack-plugin',
		'copy-webpack-plugin',
		'webpack-bundle-analyzer',
		'html-critical-webpack-plugin',
		'webpack',
		'webpack-merge',
		'rewiremock',
		'rewiremock/webpack/plugin',
		'path',
		'chalk',
		'karma',
		'fs',
		'process',
		'path-exists',
		'mkdirp',
		'gettext-extractor',
		'babel-plugin-transform-decorators-legacy',
		'babel-plugin-transform-class-properties',
		'babel-plugin-transform-object-rest-spread',
		'mini-css-extract-plugin',
		'optimize-css-assets-webpack-plugin',
	],
	watch: {
		include: 'src/**',
	},
	plugins: [
		/**
		 * Allow node_modules resolution, so you can use 'external' to control
		 * which external modules to include in the bundle
		 * @see https://github.com/rollup/rollup-plugin-node-resolve#usage
		 * order of plugins may be important
		 * @see https://github.com/ezolenko/rollup-plugin-typescript2/issues/66#issuecomment-378735446
		 */
		resolve(),
		// Compile TypeScript files
		typescript({ useTsconfigDeclarationDir: true, rollupCommonJSResolveHack: true }),
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs(),
		/**
		 * Allows the node builtins (path, fs etc.) to be required/imported.
		 *
		 * @see https://www.npmjs.com/package/rollup-plugin-node-builtins
		 */
		builtins(),

		/**
		 * Required for importing: fs process
		 */
		globals(),

		// Resolve source maps to the original source
		sourceMaps(),

		/**
		 * Report build file size.
		 *
		 * @see https://github.com/ritz078/rollup-plugin-filesize
		 */
		filesize(),

		/**
		 * Generating dependency graph.
		 *
		 * @see https://github.com/ondras/rollup-plugin-graph
		 */
		// graph({ prune: true }),
	],
};
