const fs = require('fs-extra')

const pathExists = fs.pathExists
const emptyDir = fs.emptyDir
const readdirSync = fs.readdirSync
const readFileSync = (src) => fs.readFileSync(src, 'utf8')
const writeFileSync = (dest, src) => fs.writeFileSync(dest, src, 'utf8')
const copy = (fromPath, toPath, overwrite = true) => fs.copy(fromPath, toPath, {errorOnExist: false, overwrite})

module.exports = Object.freeze(
  {
    pathExists,
    emptyDir,
    readFileSync,
    writeFileSync,
    readdirSync,
    copy,
  }
)