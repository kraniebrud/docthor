const chartSequenceFn = (tree) => (node) => {
  const {attrs, content} = node
  const result = {tag: false, content: ''}
  result.content = `<div class="mermaid">sequenceDiagram ${content}</div>`
  return result
}

module.exports = () => (tree) => {
  tree.match({tag: 'zap-chart-sequence'}, chartSequenceFn(tree))
  return tree
}