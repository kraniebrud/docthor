const beautify = require('json-beautify')

const {
  RC_FILENAME,
  PACKAGE_NAME,
  HOME_DIR,
  APP_DIR,
} 
= require('./constants')

const proccessCss = require('./process-postcss')
const initialRc = require('./read-rc')(APP_DIR)
const {emptyDir, pathExists, copy, writeFileSync} = require('./filesys')

class Processor {
  constructor (rc) {
    Object.assign(this, {rc})
  }
  async createRcFile () {
    const {title, version, src_folder, publish_folder, draft_folder} = this.rc
    const rcObj = Object.assign(initialRc, {title, version, src_folder, publish_folder, draft_folder})
    const rcJsonString = beautify(rcObj, null, 2, 60)
    const srcFolderPath = `${HOME_DIR}/${src_folder}`
    const srcFolderExists = await pathExists(srcFolderPath)
    if(!srcFolderExists) await copy(`${APP_DIR}/../_boiler/markdown`, srcFolderPath)

    const moduleWrapper = [
      'const Docthor = require("@docthor/core") \n',
      `const docthor = Docthor(${rcJsonString}) \n`,
      'docthor.run()',
    ].join('\n')

    writeFileSync(`${HOME_DIR}/${RC_FILENAME}`, moduleWrapper)
  
    return {}
  }
  async createDist (options) {
    const outFolder = options.isDraft ? this.rc.draft_folder : this.rc.publish_folder
    await emptyDir(`${HOME_DIR}/${outFolder}`) // also creates the out foulder
    const [distDir, pageDir, templateDir, templateDefaultDir, draftDir] = await Promise.all(
      [
        pathExists(`${HOME_DIR}/${PACKAGE_NAME}`), 
        pathExists(`${HOME_DIR}/${this.rc.src_folder}`),
        pathExists(`${HOME_DIR}/${PACKAGE_NAME}/template`),
        pathExists(`${HOME_DIR}/${PACKAGE_NAME}/template/default`),
      ]
    )
    if(!distDir) await copy(`${APP_DIR}/../_boiler/${PACKAGE_NAME}`, `${HOME_DIR}/${PACKAGE_NAME}`)
    if(!pageDir) await copy(`${APP_DIR}/../_boiler/markdown`, `${HOME_DIR}/${this.rc.src_folder}`)
    if(!templateDir) await copy(`${APP_DIR}/../_boiler/${PACKAGE_NAME}/template`, `${HOME_DIR}/${PACKAGE_NAME}/template`)
    if(!templateDefaultDir) await copy(`${APP_DIR}/../_boiler/${PACKAGE_NAME}/template/default`, `${HOME_DIR}/${PACKAGE_NAME}/template/default`)
    await copy(`${HOME_DIR}/${PACKAGE_NAME}/template/default/assets`, `${HOME_DIR}/${outFolder}/assets`)
    proccessCss(`${HOME_DIR}/${PACKAGE_NAME}/template/default/_src/postcss/app.css`, `${HOME_DIR}/${PACKAGE_NAME}/template/default/assets/css/app.css`)
  }
}

module.exports = Processor