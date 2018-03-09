import path from 'path';

export default (srcRoot: string) => {
	const assetPath = path.normalize(srcRoot + '/assets/');
	return [
		{
			// this is only good for local files
			// importing anything from node_modules will move it to some crazy long path in build
			// also we should avoid loading svg fonts in stylesheets so we treat fonts seperatly from other assets
			test: /\.(png|jpg|gif|svg)$/,
			// this is mostly to seperate svgs loaded as fonts and svg images located in assets folder
			include: (p: string) => path.normalize(p).startsWith(assetPath),
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
						context: assetPath, // root path only assets
						outputPath: '/assets/',
					},
				},
			],
		},
	];
};
