const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')
const chokidar = require('chokidar')
const baseManifestPath = path.join(__dirname, './manifest_base.json')
const outputManifestPath = path.join(__dirname, '../extension/manifest.json')
const outputManifestIndent = '\t'

const mode = getEnvMode()

handleFileChanged()

chokidar.watch(baseManifestPath).on('all', (event, path) => {
	handleFileChanged()
})

function handleFileChanged() {
	generateManifest(mode)
}

async function generateManifest(mode) {
	const fileContent = await fsPromise.readFile(path.resolve(__dirname, baseManifestPath), 'utf8')

	console.log(`[path][${path.resolve(__dirname, baseManifestPath)}]`)
	console.log('[start:fileContent]' + fileContent + '[end:fileContent]')

	let baseManifest = {}

	try {
		baseManifest = JSON.parse(fileContent)
	} catch (e) {
		if (e instanceof SyntaxError) {
			console.log('\n')
			console.log('キャッチされたエラー')
			console.error(e.stack)
			console.log('\n')
			return
		} else {
			throw e
		}
	}

	const outputManifest = mode === 'development' ? baseManifest : deleteWebAccessibleResourcesProp(baseManifest)

	fs.writeFileSync(
		path.resolve(__dirname, outputManifestPath),
		JSON.stringify(outputManifest, null, outputManifestIndent)
	)

	console.log(`変更が${mode}モードで${outputManifestPath}に正常に書き込まれました。(${getJapaneseCurrentTimeString()})`)
}

function deleteWebAccessibleResourcesProp(e) {
	return { ...e, web_accessible_resources: undefined }
}

function getEnvMode() {
	const text = process.argv[2]

	switch (text) {
		case 'd':
			return 'development'

		case 'p':
			return 'production'

		case 'development':
			return 'development'

		case 'production':
			return 'production'

		default:
			throw new Error('モードが指定されていません')
	}
}

function getJapaneseCurrentTimeString() {
	const now = new Date()
	const year = now.getFullYear()
	const month = now.getMonth() + 1
	const date = now.getDate()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	const seconds = now.getSeconds()

	return `${year}年${month}月${date}日 ${hours}時${minutes}分${seconds}秒`
}
