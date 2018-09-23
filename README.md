# Xes Webpack Configuration

This library contains helpers for configuring webpack and karma via set of parameters in package.json `apps` configuration field.

## Documentation

### Configuration via package.json 

You can provide application configuration via _package.json_ `apps` param:

| __param__ | __default__ | __description__
| --- | --- | --- |
| __package.apps.[appName].rootDir__ | src | directory (relative to project root) where all source code and other assets resides
| __package.apps.[appName].externalDirs__ | [] | additional directories outside of `package.apps.[appName].rootDir` in which we have source files that need to be tested or translated
| __package.apps.[appName].outDir__ | dist | directory (relative to project root) in which to put builded application
| __package.apps.[appName].main__ | ['main.js'] | entry points to your application (relative to `package.apps.[appName].rootDir`)
| __package.apps.[appName].moduleImportPaths__ | [''] | list of paths (relative to project root) on which to look for imported modules when calling `import` or `require` directives
| __package.apps.[appName].test__ | 'main.test.js' | entry point for tests (relative to `package.apps.[appName].rootDir`)
| __package.apps.[appName].assets__ | ['assets'] | all asset and resource you want to move to build assets directory (you can use glob patterns or just link to directory) (relative to `package.apps.[appName].rootDir`)
| __package.apps.[appName].fonts__ | ['fonts'] | all fonts resource you want to move to build fonts directory (you can use glob patterns or just link to directory)
| __package.apps.[appName].styles__ | ['styles/styles.scss'] | all stylesheets you want to use as entry points
| __package.apps.[appName].stylesImportPaths__ | ['./styles'] | list of paths (relative to `package.apps.[appName].rootDir`) on which to look when importing stylesheet via `@import`
| __package.apps.[appName].vendor__ | [] | all vendor scripts you want to push to vendor bundle
| __package.apps.[appName].template__ | index.html | html template that you want to use as template for website
| __package.apps.[appName].templateData__ | {} | html template is handled by ejs loader so you can put here additional data that will be passed to `htmlWebpackPlugin.options.data` you can also access _package.json_ from `htmlWebpackPlugin.options.packageConfig`
| __package.apps.[appName].languages__ | ['en'] | list of languages that will be used by application
| __package.apps.[appName].localesDir__ | 'locales' | directory for storing translations (relative to `package.apps.[appName].rootDir`)

### Source code phrase replacement

If anywhere in you code exist one of those phrases it will be replaced with data injected via __webpack.DefinePlugin__

| __phrase__ | __type__ | __default__ | __meaning__ |
|---|---|---|---|
| __process.env.DEVELOPMENT__ | _boolean_ | | project was build with development flag `--env.dev` |
| __process.env.PRODUCTION__ | _boolean_ | | project was build with production flag `--env.prod` |
| __process.env.PACKAGE__ | _object_ | | contents of _package.json_ |
| __process.env.APP__ | _object_ | | application build configuration resolved from build context |
| __process.env.APP.rootDir__ | string | _src_ | `package.apps.[appName].rootDir` |
| __process.env.APP.externalDirs__ | string[] | [] | `package.apps.[appName].externalDirs` |
| __process.env.APP.outDir__ | string | _dist_ | `package.apps.[appName].outDir` |
| __process.env.APP.rootPath__ | string | | resolved system path to `package.apps.[appName].rootDir` |
| __process.env.APP.outPath__ | string | | resolved system path to `package.apps.[appName].outDir` |
| __process.env.APP.main__ | string[] | | application entry scripts defined in `package.apps.[appName].main` |
| __process.env.APP.test__ | string | | application test entry script defined in `package.apps.[appName].test` |
| __process.env.APP.assets__ | string[] | | assets defined in `package.apps.[appName].assets` |
| __process.env.APP.fonts__ | string[] | ['./fonts'] | fonts defined in `package.apps.[appName].fonts` |
| __process.env.APP.styles__ | string[] | ['./styles/styles.scss'] | styles entry points defined in `package.apps.[appName].styles` |
| __process.env.APP.stylesImportPaths__ | string[] | ['./styles'] | styles lookup paths `package.apps.[appName].stylesImportPaths` |
| __process.env.APP.vendor__ | string[] | | vendor scripts defined in `package.apps.[appName].vendor` |
| __process.env.APP.template__ | string | _index.html_ | main template name |
| __process.env.APP.templateData__ | string | | data injected into template `htmlWebpackPlugin.options.data` |
| __process.env.LANGUAGES__ | string[] | ['en'] | languages provided via `package.apps.[appName].languages` |
| __process.env.LOCALES_DIR__ | string | 'locales' | directory name for storing translation files `package.apps.[appName].localesDir` |

__process.env__ won't have those phrases listed as its params when trying to call it after build. So it secure, in sense that you can use only what you really need.

### Additional environmental configuration via _.env_ file

If you need to add any secret configuration to your project you can use similar proccess of replacing source code as above with variables provided in _.env_ file.
For example:

_file: .env_

```env
SOME_SECRET=secret value
```

and then anywhere in javascript you can use it like this:

_file: src/some/script/path/script.js_
```javascript
const secret = process.env.SOME_SECRET;
```

_.env_ file should be excluded from you repository via _.gitignore_.
