import { Config, ConfigOptions } from 'karma';
import * as path from 'path';
import { Configuration, NewModule, Rule } from 'webpack';

import { extractAppConfig, IAppConfig } from '../app/app.config';
import { istanbulCoverageFactory } from '../webpack/loaders/istanbul-coverage';

export const configure = (
	webpack: Configuration,
	useReactSourceMapFix: boolean = true,
) => {
	const config: IAppConfig = extractAppConfig();
	const entry: string = path.join(config.rootDir, config.test);

	// add required configuration for webpack
	if (!webpack.module) {
		webpack.module = {} as NewModule;
	}

	if (!(webpack.module as NewModule).rules) {
		(webpack.module as NewModule).rules = [];
	}

	(webpack.module as NewModule).rules.push(
		...(istanbulCoverageFactory(config.rootPath) as [Rule]),
	);

	/**
	 * cheap-module-source-map - fixing react cross origin suggested in:
	 * @see https://reactjs.org/docs/cross-origin-errors.html
	 */
	if (useReactSourceMapFix) webpack.devtool = 'cheap-module-source-map';

	const options: ConfigOptions & {
		webpack?: Configuration
		coverageIstanbulReporter?: any
		customLaunchers?: any,
	} = {
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		/**
		 * frameworks to use
		 * available frameworks:
		 * @see https://npmjs.org/browse/keyword/karma-adapter
		 */
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			// { pattern: './src/**/*.spec.js', watched: false },
			// { pattern: './src/**/*.spec.ts', watched: false },
			/**
			 * Alternative usage one entry point:
			 * @see https://github.com/webpack-contrib/karma-webpack#alternative-usage
			 */
			entry,
		],

		// list of files / patterns to exclude
		exclude: [],

		/**
		 * preprocess matching files before serving them to the browser
		 * available preprocessors:
		 * @see https://npmjs.org/browse/keyword/karma-preprocessor
		 */
		preprocessors: {
			// './src/**/*.spec.js': ['webpack', 'sourcemap'],
			// './src/**/*.spec.ts': ['webpack', 'sourcemap'],
			/**
			 * Alternative usage one entry point
			 * @see https://github.com/webpack-contrib/karma-webpack#alternative-usage
			 */
			[entry]: ['webpack', 'sourcemap'],
		},

		webpack,

		/**
		 * test results reporter to use
		 * possible values: 'dots', 'progress'
		 * available reporters:
		 * @see https://npmjs.org/browse/keyword/karma-reporter
		 */
		reporters: ['progress', 'kjhtml', 'coverage-istanbul'],

		coverageIstanbulReporter: {
			reports: ['html', 'lcovonly', 'text-summary'],
			dir: path.resolve('./coverage'),
			fixWebpackSourcePaths: true,
		},

		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		// logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		/**
		 * start these browsers
		 * available browser launchers:
		 * @see https://npmjs.org/browse/keyword/karma-launcher
		 */
		browsers: ['Chrome'],

		/**
		 * fix typescript serving video/mp2t mime type
		 * @see https://github.com/angular/angular-cli/issues/2125#issuecomment-247395088
		 */
		mime: {
			'text/x-typescript': ['ts', 'tsx'],
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,
	};

	if (process.env.TRAVIS) {
		options.customLaunchers = {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox'],
			},
		};
		options.browsers = ['Chrome_travis_ci'];
	}

	return options;
};
