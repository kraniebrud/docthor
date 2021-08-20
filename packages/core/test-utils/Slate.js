const path = require('path')
const fs = require('fs-extra')

const createConfig = (dirTemp) => {
  return {
    "title": "Untitled",
    "version": "1.0.0",
    "src_folder": `./${dirTemp}/markdown`,
    "publish_folder": `./${dirTemp}/docs`,
    "draft_folder": `./${dirTemp}/_draft`,
  }
}

class Slate {
  constructor(dir, config = {}) {
    this.dir = dir
    this.dirTemp = `${dir}/.temp`
    this.config = {
      ...createConfig(this.dirTemp),
      ...config,
    }
  }
  getTestTempDir () {
    return this.dirTemp
  }
  async clean () {
    await fs.remove(path.resolve(__dirname, '..', '.docthorrc.js'))
    await fs.remove(this.dirTemp)
  }

}

module.exports = Slate
