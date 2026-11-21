
import { join } from '@std/path'
import { create, clean, isDir } from './utils/fs.js'
import config from './utils/config.js'

// recursively copy non-html files
const copy = async (source, target) => {
	await create(target)

	for await (const file of Deno.readDir(source)) {
		if(file.isFile && !file.name.endsWith('.html')) {
			await Deno.copyFile(join(source, file.name), join(target, file.name))
		}
		else if(file.isDirectory) {
			await create(join(target, file.name))
			await copy(join(source, file.name), join(target, file.name))
		}
	}
}

const version = config.Version

// directories we're working with
const source = join(Deno.cwd(), 'src')
const dist = join(Deno.cwd(), 'dist')
const distVersioned = join(dist, version)

// remove and recreate the dist directory
await clean(dist)
await create(distVersioned)

// copy files, dir by dir
const dirs = ['data', 'reactive', 'router', 'test', 'utils']

await Promise.all(dirs.map(dir => copy(join(source, dir), join(distVersioned, dir))))

console.log('Done')
