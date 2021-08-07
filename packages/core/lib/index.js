const Page = require('../bin/io/Page')

module.exports = (conf) => {
  const page = new Page(conf, {})
  let pluginsArr = []

  const callables = {
    plugin: (plugin) => {
      pluginsArr = [ ...pluginsArr, plugin ]
      return callables
    },
    run: () => {
      const files = page.createPages(pluginsArr)
      console.log('succesfully created', files)
      return callables
    }
  }

  return callables
}