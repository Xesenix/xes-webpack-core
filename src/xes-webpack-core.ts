import { NewLoaderRule, NewUseRule, OldLoaderRule, OldUseRule, OneOfRule, RulesRule } from 'webpack';

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

import * as webpack from './webpack/webpack.config';


const library = {
	application,
	karma,
	webpack: {
		...webpack,
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
};

export default library;
