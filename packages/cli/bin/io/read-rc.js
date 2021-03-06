const {RC_FILENAME, HOME_DIR} = require('./constants')

module.exports = (fromDir = HOME_DIR) => {
  try {
    return require(`${fromDir}/${RC_FILENAME}`)
  }
  catch (err) {
    return false
  }
}