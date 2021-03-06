const {HOME_DIR, PACKAGE_NAME} = require('../../constants')
const beautify = require('json-beautify')
const assert = require('assert')
const prettyJsonString = (data) => beautify(data, null, 2, 60)

const solveArray = (items) => {
  return items.properties 
    ? [formatJson(items.properties)]
    : [items.type]
}
const solveProp = (prop) => {
  return prop.enum && prop.enum[0]
    ? prop.enum[0]
    : prop.type === 'integer' ? 0
    : prop.type === 'number' ? '0'
    : prop.type === 'boolean' ? true
    : prop.type

  return prop.type
}
const formatJson = (properties = {}, isDetails = false) => {
  const obj = {}
  for(let p of Object.keys(properties)) {
    let prop = properties[p]
    obj[p] = prop.type == 'object' 
      ? formatJson(prop.properties)
      : prop.type == 'array' 
        ? solveArray(prop.items)
      : isDetails === false
        ? solveProp(prop)
        : prop
  }
  return obj
}

const bodyJsonCodeHtml = (properties) => {
  const payload = prettyJsonString(formatJson(properties))
  const details = prettyJsonString(formatJson(properties, true))
  return (
    `<div class="swagger-body hljs">
      <div class="swagger-json-block swagger-json-block-body">
        <pre>
          <code class="hljs language-json">${payload}</code>
        </pre>
      </div>
      <div class="swagger-json-block swagger-json-block-details">
        <pre>
          <code class="hljs language-json">${details}</code>
        </pre>
      </div>
    </div>`
  )
}

const parametersHtml = (parameters) => {
  const [urlParams, bodyParams] = [ // most likely always just single entry for body
    parameters.filter(p => p.in !== 'body'),
    parameters.filter(p => p.in === 'body')
  ]
  const tHeadHtml = urlParams.length > 0 
    ? `<thead>
        <th>Parameter</th>
        <th>Parameter type</th>
        <th>Value type</th>
      </thead>`
    : ''
  const urlParamsTdArr = urlParams.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.in}</td>
      <td>${p.type}</td>
    </tr>`
  )
  const bodyParamsTdArr = bodyParams.map(p => `
    <tr>
      <td colspan="3" class="swagger-body-container">${bodyJsonCodeHtml(p.schema.properties)}</td>
    </tr>`
  )
  return `
    <table class="swagger-table">
      ${tHeadHtml}
      <tbody>
        ${urlParamsTdArr.join('')}
        ${bodyParamsTdArr.join('')}
      </tbody>
    </table>`
}

const responsesHtml = (responses) => {
  const entries = Object.entries(responses)
  const tdArr = entries.map(r => {
    let [statusCode, spec] = r
    let contentHtml = bodyJsonCodeHtml(spec.schema.properties || {})
    let statusCodeHtml = `<p><b>${statusCode == 'default' ? 200 : statusCode}</b> &nbsp; ${spec.description}</p>`
    return `<tr><td>${statusCodeHtml}${contentHtml}</td></tr>`
  })
  return `
    <table class="swagger-table">
      <tbody>
        ${tdArr.join('')}
      </body>
    </table>`
}

const swaggerEndpointSpecHtml = (attrs, spec) => {
  return (
    `<aside class="swagger-endpoint-spec">
      <header class="swagger-header">
        <h1>
          <span class="swagger-method">${attrs.method}</span>
          <span class="swagger-path">${attrs.path}</span>
        </h1>
      </header>
      <main class="swagger-main">
        <div class="swagger-parameters">${parametersHtml(spec.parameters)}</div>
        <div class="swagger-responses">${responsesHtml(spec.responses)}</div>
      </main>
    </aside>`
  )
}

const specFn = (options) => (node) => {
  const {attrs} = node
  const result = {tag: false, content: undefined}
  if(attrs.name && attrs.method && attrs.path) {
    const [name, method, path] = [
      attrs.name.trim(),
      attrs.method.toLowerCase().trim(),
      attrs.path.toLowerCase().trim(),
    ]
    try {
      assert(method == 'get' || method === 'post' || method === 'put' || method === 'delete', `Method "${method}" is not allowed`)

      const filePath = `${HOME_DIR}/${PACKAGE_NAME}/resource/swagger-spec/${name}.json`
      const specfile = require(filePath)
      const spec = specfile.paths[attrs.path][method]
      result.content = swaggerEndpointSpecHtml(attrs, spec)
    }
    catch(err) {
      result.content = `${err.code} &mdash; ${err.message}`
    }
    return result
  }
  result.content = ''
  return result
}

module.exports = (options) => (tree) => {
  tree.match({tag: 'zap-swagger-spec'}, specFn(options))
  return tree
}