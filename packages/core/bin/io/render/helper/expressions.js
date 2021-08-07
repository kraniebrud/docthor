const expressions = require('posthtml-expressions')

const options = {
  delimiters: ['⚡{', '}!'],
  unescapeDelimiters: ['⚡{{', '}}!'],
  conditionalTags: ['zap-if', 'zap-elseif', 'zap-else'],
  switchTags: ['zap-switch', 'zap-case', 'zap-default'],
  loopTags: ['zap-each'],
  scopeTags: ['zap-scope']
}

module.exports = (locals) => expressions({locals, ...options})