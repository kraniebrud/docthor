const {log, info, warn, dir} = require('better-console')
const {HOME_DIR, RC_FILENAME} = require('./constants')
const Processor = require('./Processor')
const Page = require('./Page')
const readRc = require('./read-rc')

const rcInfo = `
An Initial project file ("${RC_FILENAME}") has been created. 
Please modify this file according to your needs.'
`

const init = async () => {
	const rc = readRc()
	if(rc) throw `A "${RC_FILENAME}" has already been created. If you wish to redo the init-steps, you must delete your "${RC_FILENAME}"`
	return {
		create: async ({title, version, src_folder, publish_folder, draft_folder}) => {
			const processor = new Processor({title, version, src_folder, publish_folder, draft_folder})
			await processor.createRcFile()
			return info(rcInfo)
		}
	}
}

const page = async (cfg, options) => {
	const processor = new Processor(cfg)
	const goal = new Page(cfg, options)
	await processor.createDist(options)
	const createdFiles = goal.createPages()
	info(`Documentation was succesfully build!\nFiles can now be served from ${HOME_DIR}/${cfg.publish_folder}`)
	return dir(createdFiles)
}

module.exports = () => {
	try {
		return Object.freeze({init, page})
	}
	catch(err){
		warn(err)
		process.exit(1)
	}
}