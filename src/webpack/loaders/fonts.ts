const path = require('path')

export default (srcRoot: string) => {
  const assetPath = path.normalize(srcRoot + '/assets/')
  const fontsPath = path.normalize(srcRoot + '/fonts/')
  const vendorRegExp = /node_modules(\\|\/)([^\\\/]+)/

  return [
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      // this is mostly to seperate svgs loaded as fonts and svg images located in assets folder
      exclude: (p: string) => path.normalize(p).startsWith(assetPath),
      use: [
        {
          loader: 'file-loader',
          options: {
            name: (p: string) => {
              const match = path.normalize(p).match(vendorRegExp)
              if (match) {
                // use vendor name as prefix
                return `${match[2]}/[name].[ext]`
              }
              return '[path][name].[ext]'
            },
            context: fontsPath, // root path for fonts
            outputPath: '/fonts/'
          }
        }
      ]
    }
  ]
}
