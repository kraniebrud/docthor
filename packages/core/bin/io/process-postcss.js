const {readFile, writeFile} = require('fs-extra')
const postcss = require('postcss')
const postcssPresetEnv = require('postcss-preset-env')

module.exports = (from, to) => {
  const plugins = [
    postcssPresetEnv({
      tage: 3,
      features: {
        'nesting-rules': true
      },
      autoprefixer: { grid: true }
    })
  ]
  try {
    readFile(from, (_err, css) => 
      postcss(plugins).process(css, {from, to})
      .then(result => {
        if(result.map) writeFile(`${to}.map`, result.map)
        return writeFile(to, result.css)
      })
    )
  }
  catch(err) {
    throw err
  }
}