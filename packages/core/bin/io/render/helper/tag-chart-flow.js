const fcContent = (content, {from, to} = {}) => {
  return `<div class="mermaid">graph ${from}${to} ${content}</div>`
}

const fcDirection = (directions) => {
  const from = directions.from ? directions.from.toLowerCase() : 'left'
  const to = directions.to ? directions.to.toLowerCase() : 'right'
  const short = {left: 'L', top: 'T', right: 'R', bottom: 'B'}
  return {
    from: short[from] || 'L',
    to: short[to] || 'R'
  }
}

const flowchartFn = (tree) => (node) => {
  const {attrs, content} = node
  const result = {tag: false, content: ''} 
  const {from, to} = attrs || {}
  result.content = fcContent(content, fcDirection({from, to}))
  return result
}

module.exports = () => (tree) => {
  tree.match({tag: 'zap-chart-flow'}, flowchartFn(tree))
  return tree
}