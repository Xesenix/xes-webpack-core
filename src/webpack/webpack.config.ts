import chalk from 'chalk';
import * as path from 'path';
import * as pathExists from 'path-exists';
import * as baseWebpack from 'webpack';

/**
 * Handling page template.
 */
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * Minify production build.
 */
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

/**
 * Add secret configuration options via .env file.
 */
import DotenvWebpackPlugin from 'dotenv-webpack';

/**
 * Clean up destination directory.
 */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

/**
 * Copy assets and fonts.
 */
import CopyWebpackPlugin from 'copy-webpack-plugin';

/**
 * Analyze project size.
 */
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/**
 * Analyze dependencies duplicates.
 */
import { DuplicatesPlugin } from 'inspectpack/plugin';

/**
 * Add ability to observe module download progress.
 */
import ChunkProgressWebpackPlugin from 'chunk-progress-webpack-plugin';

/**
 * Order scripts and styles increasing startup speed noticable in google analytics.
 * @see https://survivejs.com/webpack/styling/eliminating-unused-css/#critical-path-rendering
 */
import HtmlCriticalPlugin from 'html-critical-webpack-plugin';

/**
 * For minifying production CSS.
 */
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { assetsRulesFactory } from './loaders/assets';
import { babelRulesFactory } from './loaders/babel';
import { fontsRulesFactory } from './loaders/fonts';
import { translationRulesFactory } from './loaders/locale';
import { markdownRulesFactory } from './loaders/markdown';
import { stylesRulesFactory } from './loaders/styles';
import { cssPluginFactory } from './plugins/css';

import { extractAppConfig, getEnvApp, getPackageConfig, IAppConfig, projectRoot } from '../app/app.config';
import { getEnvConfiguration } from '../environment/environment.config';

export const webpackConfigFactory = ({
	isProd = process.env.ENV === 'production',
	isTest = process.env.ENV === 'test',
	isDev = process.env.ENV === 'development',
	hmr = !!process.env.HMR,
	analyze = !!process.env.ANALYZE,
	useBabelrc = false,
	app = getEnvApp(),
	config = extractAppConfig(),
	packageConfig = getPackageConfig(),
	// order of chunks is important for style overriding (more specific styles source later)
	chunks = ['vendor', 'styles', 'main'],
	env = getEnvConfiguration(process.env.ENV || 'app', app),
}: {
	isProd?: boolean,
	isTest?: boolean,
	isDev?: boolean,
	hmr?: boolean,
	analyze?: boolean,
	useBabelrc?: boolean,
	app?: string,
	config?: IAppConfig,
	packageConfig?: any,
	chunks?: string[],
	env?: any,
} = {}): baseWebpack.Configuration => {
	console.log(`Project root path: ${chalk.blue(projectRoot)}`);
	console.log(`Running app name: ${chalk.blue(app)}`);
	console.log(`Env isProd: ${chalk.blue(isProd as any)}`);
	console.log(`Env isTest: ${chalk.blue(isTest as any)}`);
	console.log(`Env isDev: ${chalk.blue(isDev as any)}`);
	console.log(`Analyze: ${chalk.blue(analyze as any)}`);
	console.log('App config:', config);

	const processEnv = Object.entries(env).reduce((result, [key, value]) => {
		result[`process.env.${key}`] = JSON.stringify(value);

		return result;
	}, {} as any);

	const extractCssPlugin = cssPluginFactory(isProd);

	/**
	 * Setup generation of html template in which all scripts and styles are included.
	 * @see https://github.com/jantimon/html-webpack-plugin#configuration
	 */
	const htmlPlugin = new HtmlWebpackPlugin({
		packageConfig,
		data: {
			title: `${packageConfig.name} - ${packageConfig.version}`,
			...config.templateData,
			env,
		},
		template: `!!ejs-loader!${config.rootDir}/${config.template}`,
		inject: true,
		// order of injected style tags
		// TODO: confirm that this typescript arguments types are correct
		chunksSortMode: (a: { id: string, parents: string[] }, b: { id: string, parents: string[] }) =>
			chunks.indexOf(a.parents[0]) > chunks.indexOf(b.parents[0]) ? 1 : -1,
		minify: {
			removeComments: true,
			preserveLineBreaks: true,
		},
		xhtml: false,
		mobile: true,
		showErrors: true,
	});

	const htmlCriticalPlugin = new HtmlCriticalPlugin({
		base: config.outPath,
		src: 'index.html',
		dest: 'index.html',
		inline: true,
		minify: true,
		extract: true,
		width: 375,
		height: 565,
		penthouse: {
			blockJSRequests: false,
		},
	});

	const entry: { [key: string]: string } = {};

	// compose entry points
	chunks
		.filter((key: string) => (config as any)[key].length > 0)
		.forEach((key: string) => (entry[key] = (config as any)[key]));

	const externals = {
		// 'react': './node_modules/react/umd/react.production.min.js',
		// 'react-dom': './node_modules/react-dom/umd/react-dom.production.min.js',
	};

	const webpackConfig = {
		mode: (isProd ? 'production' : 'development') as 'development' | 'production' | 'none',
		entry,
		externals,
		output: {
			path: config.outPath,
			filename: '[name].bundle.js',
		},
		devServer: {
			contentBase: [
				config.outPath, // assets needs project to be build before they load from that path
			],
			hot: hmr,
		},
		devtool: (isProd ? false : 'cheap-eval-source-map') as baseWebpack.Options.Devtool, // https://webpack.js.org/configuration/devtool/
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
			modules: [...config.moduleImportPaths, config.rootPath, 'node_modules'],
		},
		module: {
			rules: [
				...fontsRulesFactory(config.rootPath),
				...assetsRulesFactory(config.rootPath),
				...stylesRulesFactory(
					config.stylesImportPaths,
					hmr,
				),
				...babelRulesFactory(useBabelrc),
				...markdownRulesFactory(),
				...translationRulesFactory(),
			],
		},
		plugins: [
			new baseWebpack.DefinePlugin(processEnv),
			isTest ? null : htmlPlugin,
			extractCssPlugin,
			!isProd ? null : htmlCriticalPlugin,
			new baseWebpack.LoaderOptionsPlugin({
				minimize: isProd,
				debug: !isProd,
				sourceMap: !isProd,
				options: {
					tslint: {
						emitErrors: true,
						failOnHint: true,
					},
				},
			}),
			isTest
				? null
				: new CopyWebpackPlugin(
						[...config.assets, ...config.fonts]
							.filter((p) => !!p)
							.filter((p) => pathExists.sync(path.join(config.rootDir, p)))
							.map(
								(from) => typeof from === 'string'
									? {
											from: path.join(config.rootDir, from),
											to: path.join(config.outPath, from),
										}
									: from,
							),
						{
							debug: isProd ? 'warning' : 'info',
						},
					),
			!isProd
				? null
				: new CleanWebpackPlugin(),
			new DotenvWebpackPlugin({ path: '.env', silent: true }),
			new baseWebpack.EnvironmentPlugin({
				NODE_ENV: isProd ? 'production' : isTest ? 'test' : 'development',
			}),
			new baseWebpack.DefinePlugin({
				'process.env.PRODUCTION': JSON.stringify(isProd),
				'process.env.DEVELOPMENT': JSON.stringify(isDev),
				'process.env.TEST': JSON.stringify(isTest),
				'process.env.PACKAGE': JSON.stringify(packageConfig),
				'process.env.APP': JSON.stringify(config),
				'process.env.LANGUAGES': JSON.stringify(config.languages),
				'process.env.LOCALES_DIR': JSON.stringify(config.localesDir),
			}),

			/**
			 * For analyzing size and module dependency.
			 * @see https://github.com/webpack-contrib/webpack-bundle-analyzer
			 */
			analyze
				? new BundleAnalyzerPlugin({
						analyzerMode: 'server',
						openAnalyzer: true,
						// statsFilename: path.join(config.outPath, 'stats.json'),
						generateStatsFile: true,
					})
				: null,

			/**
			 * Coding without reloading pages requires this plugin.
			 *
			 * Additionally it is required for testing with rewiremock.
			 * @see https://github.com/theKashey/rewiremock#to-run-inside-webpack-enviroment
			 */
			isDev && hmr ? new baseWebpack.HotModuleReplacementPlugin() : null,
			new DuplicatesPlugin(),
			new ChunkProgressWebpackPlugin(),
		].filter((p) => !!p),
		optimization: {
			namedModules: isDev || hmr || isTest,
			splitChunks: {
				name: 'vendor',
				// minChunks: ({ resource }: { resource: string }) => /node_modules/.test(resource) ? 1 : 0,
			},
			noEmitOnErrors: isTest,
			concatenateModules: false,
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true, // set to true if you want JS source maps
				}),
				new OptimizeCSSAssetsPlugin({}),
			],
		},
	};

	return webpackConfig;
};
