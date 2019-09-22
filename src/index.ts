import * as application from './app/app.config';

import * as karma from './karma/karma.config';

import { assetsRulesFactory } from './webpack/loaders/assets';
import { babelRulesFactory } from './webpack/loaders/babel';
import { fontsRulesFactory } from './webpack/loaders/fonts';
import { istanbulCoverageFactory } from './webpack/loaders/istanbul-coverage';
import { translationRulesFactory } from './webpack/loaders/locale';
import { markdownRulesFactory } from './webpack/loaders/markdown';
import { shaderRulesFactory } from './webpack/loaders/shaders';
import { stylesRulesFactory } from './webpack/loaders/styles';
import { cssPluginFactory } from './webpack/plugins/css';

import * as webpackConfigurator from './webpack/webpack.config';

import * as i18n from './i18n/extractor';

export default {
	application,
	i18n,
	karma,
	webpack: {
		...webpackConfigurator,
		loaders: {
			assetsRulesFactory,
			babelRulesFactory,
			fontsRulesFactory,
			istanbulCoverageFactory,
			translationRulesFactory,
			markdownRulesFactory,
			shaderRulesFactory,
			stylesRulesFactory,
		},
		plugins: {
			cssPluginFactory,
		},
	},
} as any;
