import * as path from 'path';

export interface IAppConfig {
	/**
	 *
	 */
	rootDir: string;

	/**
	 *
	 */
	outDir: string;

	/**
	 *
	 */
	rootPath: string;

	/**
	 *
	 */
	outPath: string;

	/**
	 * entry points to your application (relative to package.apps.[appName].rootDir)
	 */
	main: string[];

	/**
	 * entry point for tests (relative to package.apps.[appName].rootDir)
	 */
	test: string;

	/**
	 * all vendor scripts you want to push to vendor bundle
	 */
	vendor: string[];

	/**
	 * list of paths (relative to project root) on which to look for imported modules when calling import or require directives
	 */
	moduleImportPaths: string[];

	/**
	 * all asset and resource you want to move to build assets directory
	 * you can use glob patterns or just link to directory
	 * (relative to package.apps.[appName].rootDir)
	 */
	assets: string[];

	/**
	 * all fonts resource you want to move to build fonts directory
	 * you can use glob patterns or just link to directory
	 */
	fonts: string[];

	/**
	 * list of entry point stylesheets
	 */
	styles: string[];

	/**
	 * list of paths (relative to package.apps.[appName].rootDir) on which to look when importing stylesheet via @import
	 */
	stylesImportPaths: string[];

	/**
	 * list of languages that will be used by application
	 */
	languages: string[];

	/**
	 * html template that you want to use as template for website
	 */
	template: string;

	/**
	 * html template is handled by ejs loader so you can put here additional data
	 * that will be passed to htmlWebpackPlugin.options.data you can also access
	 * package.json from htmlWebpackPlugin.options.packageConfig
	 */
	templateData: any;

	/**
	 * directory for storing translations (relative to package.apps.[appName].rootDir)
	 */
	localesDir: string;
}

/**
 * Absolute path to project root.
 */
export const projectRoot = path.resolve('./');

/**
 * Get current application name from environment.
 */
export const getEnvApp = () => process.env.APP || 'app';

/**
 * Get project package.json content.
 */
// tslint:disable:no-var-requires
export const packageConfig: any = require(path.resolve(projectRoot, './package.json'));

/**
 * Creates helper for extracting one of application configuration values from package.json apps[app] field.
 *
 * @param string app application configuration key
 */
export const retrievePackageAppConfig = (app: string) =>
	packageConfig.apps && packageConfig.apps[app]
		? (key: string, defaultValue: any) =>
				packageConfig.apps[app][key]
					? packageConfig.apps[app][key]
					: defaultValue
		: (key: string, defaultValue: any) => defaultValue;

/**
 * Extracts all application configuration from package.json apps[app] field.
 * Fill missing with default data and fix paths.
 *
 * @param string app application configuration key
 */
export const getAppConfig = (app: string): IAppConfig => {
	const config: IAppConfig = {} as IAppConfig;

	// helpers
	const get = retrievePackageAppConfig(app);
	const fixPathRegExp = /\\/g;
	const fixPaths = (p: string) => p.replace(fixPathRegExp, '/');

	// project paths
	config.rootDir = get('rootDir', 'src').replace(fixPathRegExp, '/');
	config.outDir = get('outDir', 'dist').replace(fixPathRegExp, '/');
	config.rootPath = path.normalize(path.resolve(projectRoot, config.rootDir));
	config.outPath = path.normalize(path.resolve(projectRoot, config.outDir));

	// modules lookup paths
	config.moduleImportPaths = get('moduleImportPaths', []).map(fixPaths);
	config.stylesImportPaths = get('stylesImportPaths', [
		path.join(config.rootDir, './styles'),
	]).map(fixPaths);

	// entry points
	config.main = get('main', ['./main.js']).map(fixPaths);
	config.test = get('test', 'main.test.js').replace(fixPathRegExp, '/');
	config.vendor = get('vendor', []);
	config.assets = get('assets', ['./assets']).map(fixPaths);
	config.fonts = get('fonts', ['./fonts']).map(fixPaths);
	config.styles = get('styles', ['styles/styles.scss']).map(fixPaths);

	// template
	config.template = get('template', 'index.html').replace(
		fixPathRegExp,
		'/',
	);
	config.templateData = get('templateData', {});

	// localization
	config.languages = get('languages', ['en']);
	config.localesDir = get('localesDir', 'locales').replace(
		fixPathRegExp,
		'/',
	);

	return config;
};
