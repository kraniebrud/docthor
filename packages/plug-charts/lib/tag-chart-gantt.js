const parser = require('posthtml-parser')

const chartGanttFn = (tree) => (node) => {
  const {attrs, content} = node
  const result = {tag: false, content: ''}
  const title = attrs && attrs.title ? attrs.title : ''
  const dateFormat = attrs && attrs['date-format'] ? attrs['date-format'] : 'YYYY-MM-DD'

  result.content = `<div class="mermaid">gantt title ${title} \n dateFormat ${dateFormat} \n ${content}</div>`
  return result
}

module.exports = () => (tree) => {
  tree.match({tag: 'zap-chart-gantt'}, chartGanttFn(tree))
  return tree
}