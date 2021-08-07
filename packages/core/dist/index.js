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
      page.create(pluginsArr)
      return callables
    }
  }

  return callables
}