const path = require('path')

export interface AppConfig {
  /**
	 *
	 */
  rootDir: string

  /**
	 *
	 */
  outDir: string

  /**
	 *
	 */
  rootPath: string

  /**
	 *
	 */
  outPath: string

  /**
	 * entry points to your application (relative to package.apps.[appName].rootDir)
	 */
  main: string[]

  /**
	 * entry point for tests (relative to package.apps.[appName].rootDir)
	 */
  test: string

  /**
	 * all vendor scripts you want to push to vendor bundle
	 */
  vendor: string[]

  /**
	 * list of paths (relative to project root) on which to look for imported modules when calling import or require directives
	 */
  moduleImportPaths: string[]

  /**
	 * all asset and resource you want to move to build assets directory
	 * you can use glob patterns or just link to directory
	 * (relative to package.apps.[appName].rootDir)
	 */
  assets: string[]

  /**
	 * all fonts resource you want to move to build fonts directory
	 * you can use glob patterns or just link to directory
	 */
  fonts: string[]

  /**
	 * list of entry point stylesheets
	 */
  styles: string[]

  /**
	 * list of paths (relative to package.apps.[appName].rootDir) on which to look when importing stylesheet via @import
	 */
  stylesImportPaths: string[]

  /**
	 * list of languages that will be used by application
	 */
  languages: string[]

  /**
	 * html template that you want to use as template for website
	 */
  template: string

  /**
	 * html template is handled by ejs loader so you can put here additional data
	 * that will be passed to htmlWebpackPlugin.options.data you can also access
	 * package.json from htmlWebpackPlugin.options.packageConfig
	 */
  templateData: any

  /**
	 * directory for storing translations (relative to package.apps.[appName].rootDir)
	 */
  localesDir: string
}

/**
 * Absolute path to project root.
 */
const projectRoot = path.resolve('./')

/**
 * Get current application name from environment.
 */
const getEnvApp = () => process.env.APP || 'app'

/**
 * Get project package.json content.
 */
const packageConfig = require(path.resolve(projectRoot, './package.json'))

/**
 * Extract one of application configuration from package.json apps[app][key] field.
 *
 * @param string app application configuration key
 */
const retrievePackageAppConfig = (app: string) =>
  packageConfig.apps && packageConfig.apps[app]
    ? (key: string, defaultValue: any) =>
        packageConfig.apps[app][key]
          ? packageConfig.apps[app][key]
          : defaultValue
    : (key: string, defaultValue: any) => defaultValue

/**
 * Extract all application configuration from package.json apps[app] field.
 * Fill missing with default data and fix paths.
 *
 * @param string app application configuration key
 */
const getAppConfig = (app: string): AppConfig => {
  const config: AppConfig = {} as AppConfig

  // helpers
  const getAppConfig = retrievePackageAppConfig(app)
  const fixPathRegExp = /\\/g
  const fixPaths = (p: string) => p.replace(fixPathRegExp, '/')

  // project paths
  config.rootDir = getAppConfig('rootDir', 'src').replace(fixPathRegExp, '/')
  config.outDir = getAppConfig('outDir', 'dist').replace(fixPathRegExp, '/')
  config.rootPath = path.normalize(path.resolve(projectRoot, config.rootDir))
  config.outPath = path.normalize(path.resolve(projectRoot, config.outDir))

  // modules lookup paths
  config.moduleImportPaths = getAppConfig('moduleImportPaths', []).map(fixPaths)
  config.stylesImportPaths = getAppConfig('stylesImportPaths', [
    path.join(config.rootDir, './styles')
  ]).map(fixPaths)

  // entry points
  config.main = getAppConfig('main', ['./main.js']).map(fixPaths)
  config.test = getAppConfig('test', 'main.test.js').replace(fixPathRegExp, '/')
  config.vendor = getAppConfig('vendor', [])
  config.assets = getAppConfig('assets', ['./assets']).map(fixPaths)
  config.fonts = getAppConfig('fonts', ['./fonts']).map(fixPaths)
  config.styles = getAppConfig('styles', ['styles/styles.scss']).map(fixPaths)

  // template
  config.template = getAppConfig('template', 'index.html').replace(
    fixPathRegExp,
    '/'
  )
  config.templateData = getAppConfig('templateData', {})

  // localization
  config.languages = getAppConfig('languages', ['en'])
  config.localesDir = getAppConfig('localesDir', 'locales').replace(
    fixPathRegExp,
    '/'
  )

  return config
}

export {
  getEnvApp,
  projectRoot,
  packageConfig,
  retrievePackageAppConfig,
  getAppConfig
}
