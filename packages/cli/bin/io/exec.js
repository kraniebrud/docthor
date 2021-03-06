const {log, info, warn, dir} = require('better-console')
const {HOME_DIR, RC_FILENAME} = require('./constants')
const Processor = require('./Processor')
const Wiki = require('./Wiki')
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

const wiki = async (options) => {
	const rc = readRc()
	if(!rc) throw `No "${RC_FILENAME}" has been created, please use "init" first to create this file.`
	const processor = new Processor(rc)
	const goal = new Wiki(rc, options)
	await processor.createDist(options)
	const createdFiles = goal.create()
	info(`Documentation was succesfully build!\nFiles can now be served from ${HOME_DIR}/${rc.publish_folder}`)
	return dir(createdFiles)
}

module.exports = () => {
	try {
		return Object.freeze({init, wiki})
	}
	catch(err){
		warn(err)
		process.exit(1)
	}
}