import chalk from 'chalk';
import { GettextExtractor, JsExtractors } from 'gettext-extractor';
import { JsParser } from 'gettext-extractor/dist/js/parser';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

import { extractAppConfig, IAppConfig } from '../app/app.config';

export const configureJsParser = (
	xi18n: GettextExtractor,
): JsParser => xi18n.createJsParser([
	JsExtractors.callExpression('__', {
		arguments: {
			text: 0,
			context: 1,
		},
	}),
	JsExtractors.callExpression('_p', {
		arguments: {
			text: 1,
			textPlural: 2,
			context: 3,
		},
	}),
]);

/**
 * Go trough localesExtractDirs and application root and extract
 */
export const extractFromScripts = (
	parser: JsParser,
	config: IAppConfig,
): void => {
	console.log(chalk.green('Extracting translation from scripts'));
	console.log(chalk.grey('-------------------------------------'));
	console.log(`App: ${chalk.blue(config.app)}`);

	// loop through paths for which to extract localization functions
	[config.rootDir, ...config.localesExtractDirs].forEach((p: string) => {
		console.log(`Searching for segments from: ${chalk.blue(p)}`);
		parser.parseFilesGlob(path.join(p, './**/*.@(ts|js|tsx|jsx)'), {
			ignore: '**/*.spec.*',
		});
	});
};

export const storeMessagesPot = (
	xi18n: GettextExtractor,
	config: IAppConfig,
): void => {
	const localesDir = path.resolve(config.rootDir, config.localesDir);
	const potPath = path.resolve(localesDir, './messages.pot');

	// create locales directory if it doesn't exists
	mkdirp.sync(localesDir);

	// write extracted messages to locales/messages.pot
	xi18n.savePotFile(potPath);

	xi18n.printStats();
	console.log(`Extracted translation segments added to: ${chalk.blue(potPath)}`);
};

/**
 * Extract translation segments from application.
 *
 * @param GettextExtractor config.xi18n pre-configured extractor
 * @param IAppConfig config.appConfig override application configuration
 * @param (xi18n: GettextExtractor) => JsParser config.configureJsParser override script translation parser
 * @param (parser: JsParser, config: IAppConfig) => void config.processScripts describe how to use parser to extract translation segments
 * @param (xi18n: GettextExtractor, config: IAppConfig) => void config.storeResult describes how to store extracted translation segments
 */
export const extract = ({
	xi18n = new GettextExtractor(),
	appConfig = extractAppConfig(),
	getJsParser = configureJsParser,
	processScripts = extractFromScripts,
	storeResult = storeMessagesPot,
} = {}) => {
	const startTime = Date.now();
	const parser = getJsParser(xi18n);

	processScripts(parser, appConfig);
	storeResult(xi18n, appConfig);

	console.log(chalk.grey(`Extraction time: ${((Date.now() - startTime) / 1000).toFixed(3)} sek`));
};
