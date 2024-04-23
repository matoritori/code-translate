import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'

type Argv = { mode?: Mode }

module.exports = (env: any, argv: Argv) => {
	const { isBuild, testServerPath, isServe, mode } = getParams(env, argv)

	return {
		...(isServe
			? {
					devServer: {
						static: {
							directory: testServerPath,
						},
						client: {
							overlay: {
								errors: true,
								warnings: false,
								runtimeErrors: true,
							},
							reconnect: 5,
						},
					},
			  }
			: {}),
		entry: isBuild
			? {
					'content-script': path.join(__dirname, './src/content-script/index.ts'),
					background: path.join(__dirname, './src/background/index.ts'),
					options: { import: path.join(__dirname, './src/options/index.tsx'), dependOn: 'react-vendors' },
					popup: { import: path.join(__dirname, './src/popup/index.tsx'), dependOn: 'react-vendors' },
					'react-vendors': ['react', 'react-dom'],
			  }
			: testServerPath,
		output: isBuild
			? {
					path: path.resolve(__dirname, './extension/dist'),
					filename: '[name].js',
					clean: true,
			  }
			: {
					path: testServerPath,
					filename: 'index.js',
			  },
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					include: testServerPath
						? [path.resolve(__dirname, './src'), testServerPath]
						: [path.resolve(__dirname, './src')],
					exclude: /node_modules/,
				},
				{
					test: /\.(sa|sc|c)ss$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				},
			],
		},

		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
			alias: {
				'@background': path.resolve(__dirname, 'src/background'),
				'@content-script': path.resolve(__dirname, 'src/content-script'),
				'@models': path.resolve(__dirname, 'src/models'),
				'@options': path.resolve(__dirname, 'src/options'),
				'@popup': path.resolve(__dirname, 'src/popup'),
				'@storage': path.resolve(__dirname, 'src/storage'),
				'@utils': path.resolve(__dirname, 'src/utils'),
				'@root': path.resolve(__dirname, 'src'),
			},
		},

		devtool: isServe || (isBuild && mode == 'development') ? 'source-map' : false,

		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
			}),
		],

		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: false,
				}),
			],
		},
	}
}

export type Mode = 'production' | 'development'

function getParams(env: any, argv: Argv): getParamsReturns {
	const { WEBPACK_BUNDLE: isBundle, WEBPACK_SERVE: isServe, WEBPACK_BUILD: isBuild, p, d, ...parameters } = env

	const testServerDir = Object.keys(parameters)[1]

	if (isServe && testServerDir === undefined) {
		throw new Error('テストサーバーディレクトリの指定が無いか間違っています')
	}

	const testServerPath = isServe && testServerDir !== undefined && path.join(__dirname, testServerDir)

	if (isServe) {
		console.log('')
		console.log('server-path:', testServerPath)
		console.log('')
	}

	const mode: Mode = (() => {
		if (argv.mode) return argv.mode
		else if (p) return 'production'
		else if (d) return 'development'

		return 'development'
	})()

	return {
		isBundle,
		isServe,
		isBuild,
		testServerDir,
		testServerPath,
		mode,
	}
}

interface getParamsReturns {
	isBundle: boolean
	isServe: boolean
	isBuild: boolean

	/**
	 * テストサーバーの起点ディレクトリの相対パス
	 */
	testServerDir?: string

	/**
	 * テストサーバーの起点ディレクトリの絶対パス
	 */
	testServerPath?: string

	mode: Mode
}
