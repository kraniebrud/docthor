const parser = require('posthtml-parser')

const draftFn = (options, tree) => (node) => {
  const {isDraft} = options || {} 
  const {content} = node 
  return {tag: false, content: parser(isDraft ? content : '')}
}

module.exports = (options) => (tree) => {
  tree.match({tag: 'zap-draft'}, draftFn(options, tree))
  return tree
}