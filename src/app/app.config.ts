import * as fs from 'fs';
import * as path from 'path';

export interface IAppConfig {
	/**
	 * Application key used to extract configuration from package.json apps field.
	 */
	app: string;

	/**
	 * Application root directory relative to project root.
	 */
	rootDir: string;

	/**
	 * Additional paths to look for tests and to translate.
	 */
	externalDirs: string[];

	/**
	 * Destination path for build result.
	 */
	outDir: string;

	/**
	 * System path to application root directory.
	 */
	rootPath: string;

	/**
	 * System path to additional paths to look for tests and for translation.
	 */
	externalPaths: string[];

	/**
	 * System path to build destination.
	 */
	outPath: string;

	/**
	 * Entry points to your application (relative to package.apps.[appName].rootDir)
	 */
	main: string[];

	/**
	 * Entry point for tests (relative to package.apps.[appName].rootDir)
	 */
	test: string;

	/**
	 * All vendor scripts you want to push to vendor bundle
	 */
	vendor: string[];

	/**
	 * List of paths (relative to project root) on which to look for imported modules when calling import or require directives
	 */
	moduleImportPaths: string[];

	/**
	 * All asset and resource you want to move to build assets directory
	 * you can use glob patterns or just link to directory
	 * (relative to package.apps.[appName].rootDir)
	 */
	assets: string[];

	/**
	 * All fonts resource you want to move to build fonts directory
	 * you can use glob patterns or just link to directory
	 */
	fonts: string[];

	/**
	 * List of entry point stylesheets
	 */
	styles: string[];

	/**
	 * List of paths (relative to package.apps.[appName].rootDir) on which to look when importing stylesheet via @import
	 */
	stylesImportPaths: string[];

	/**
	 * List of languages that will be used by application
	 */
	languages: string[];

	/**
	 * Directory for storing translations (relative to package.apps.[appName].rootDir)
	 */
	localesDir: string;

	/**
	 * HTML template that you want to use as template for application rendering.
	 */
	template: string;

	/**
	 * HTML template is handled by ejs loader so you can put here additional data
	 * that will be passed to htmlWebpackPlugin.options.data you can also access
	 * package.json from htmlWebpackPlugin.options.packageConfig
	 */
	templateData: any;
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
 * For caching extracted package.json.
 */
let packageConfig: any;

/**
 * Get project package.json content.
 * @param force reload package.json from disc
 */
export const getPackageConfig: any = (force: boolean = false) => {
	if (force || !packageConfig) {
		packageConfig = JSON.parse(fs.readFileSync(path.resolve(projectRoot, './package.json'), { encoding: 'utf-8' }));
	}
	return packageConfig;
};

/**
 * Creates helper for extracting one of application configuration values from package.json apps[app] field.
 *
 * @param string app application configuration key
 */
export const retrievePackageAppConfig = (app: string, packageJson: any = getPackageConfig()) =>
	packageJson.apps && packageJson.apps[app]
		? (key: string, defaultValue: any) =>
				packageJson.apps[app][key]
					? packageJson.apps[app][key]
					: defaultValue
		: (key: string, defaultValue: any) => defaultValue;

/**
 * Extracts all application configuration from package.json apps[app] field.
 * Fill missing with default data and fix paths.
 *
 * @param string app application configuration key
 * @param (app: string) => (key: string, defaultValue: any) => any getConfig function for extracting
 */
export const extractAppConfig = ({
	app = getEnvApp(),
	getConfigFactory = retrievePackageAppConfig,
	packageJson = getPackageConfig(),
} = {}): IAppConfig => {
	const config: IAppConfig = { app } as IAppConfig;

	// helpers
	const get = getConfigFactory(app, packageJson);
	const fixPathRegExp = /\\/g;
	const fixPaths = (p: string) => p.replace(fixPathRegExp, '/');

	// project paths
	config.rootDir = get('rootDir', 'src').replace(fixPathRegExp, '/');
	config.outDir = get('outDir', 'dist').replace(fixPathRegExp, '/');
	config.rootPath = path.normalize(path.resolve(projectRoot, config.rootDir));
	config.outPath = path.normalize(path.resolve(projectRoot, config.outDir));

	// project external paths
	config.externalDirs = get('externalDirs', []).map(fixPaths);
	config.externalPaths = config.externalDirs.map((p: string) => path.normalize(path.resolve(projectRoot, p)));

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
