import chalk from 'chalk';
import fs from 'fs';

export const getEnvConfiguration = (envName: string, appName: string) => {
	console.log(chalk.bold.yellow('Reading environment config files:'));
	return [
		// prettier-ignore
		'default.env',
		'.env',
		`${envName}.env`,
		`${appName}.env`,
		`${appName}.${envName}.env`,
	].reduce((result, filePath) => {
		if (fs.existsSync(filePath)) {
			console.log(chalk.bold.yellow('Adding env config from: '), filePath);
			result = { ...result, ...require('dotenv').config({ path: filePath }).parsed };
		}
		return result;
	}, {});
};
