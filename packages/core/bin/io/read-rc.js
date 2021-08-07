const fs = require('fs')

const {RC_FILENAME, HOME_DIR} = require('./constants')

module.exports = (fromDir = HOME_DIR) => {
  try {
    const f = `${fromDir}/${RC_FILENAME}`
    return fs.existsSync(f) ? true : false
  }
  catch (err) {
    return false
  }
}