const {join} = require('path')

const PACKAGE_NAME = '.'
//const PACKAGE_NAME = 'docthor'
const RC_FILENAME = `.docthorrc.json`
const HOME_DIR = process.cwd()
const APP_DIR = __dirname

module.exports = {
  RC_FILENAME,
  PACKAGE_NAME,
  HOME_DIR,
  APP_DIR,
}