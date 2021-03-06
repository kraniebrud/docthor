const {HOME_DIR, PACKAGE_NAME} = require('../../constants')
const {readFileSync, pathExists} = require('../../filesys')
const parser = require('posthtml-parser')

const includeFn = (options, tree) => (node) => {
  const {srcFolder} = options
  const {attrs} = node
  const result = {tag: false, content: undefined}
  if(attrs.md) {
    const f = `${HOME_DIR}/${srcFolder}/${attrs.md}`
    const filePath = f.substr(f.length - '.md'.length) !== '.md' ? `${f}.md` : f
    if(pathExists(filePath)) result.content = parser(readFileSync(filePath))
  }
  return result
}

module.exports = (options) => (tree) => {
  tree.match({tag: 'zap-include'}, includeFn(options, tree))
  return tree
}