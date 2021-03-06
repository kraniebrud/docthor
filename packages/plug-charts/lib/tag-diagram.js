const {readFileSync, pathExists} = require('../../filesys')
const parser = require('posthtml-parser')

const diagramContent = (type, content, {from, to} = {}) => {
  return type === 'graph' 
    ? `<div class="mermaid">${type} ${from}${to} ${content}</div>`
    : `<div class="mermaid">${type} ${content}</div>`
}

const graphDirection = (directions) => {
  const from = directions.from ? directions.from.toLowerCase() : 'left'
  const to = directions.to ? directions.to.toLowerCase() : 'right'
  const short = {left: 'L', top: 'T', right: 'R', bottom: 'B'}
  return {
    from: short[from] || 'L',
    to: short[to] || 'R'
  }
}
const diagramFn = (tree) => (node) => {
  const {attrs, content} = node
  const result = {tag: false, content: ''} 
  if(attrs.type === 'graph') {
    const {from, to} = attrs
    result.content = diagramContent('graph', content, graphDirection({from, to}))
  }
  if(attrs.type === 'sequence') {
    result.content = diagramContent('sequenceDiagram', content)
  }
  if(attrs.type === 'gantt') {
    result.content = diagramContent('gantt', content)
  }
  return result
}

module.exports = () => (tree) => {
  tree.match({tag: 'zap-diagram'}, diagramFn(tree))
  return tree
}