const Githubslugger = require('github-slugger')
const markdown = require('./util.markdown')
const slugger = new Githubslugger()

const posthtml = require('posthtml')
const tagInclude = require('./helper/tag-include')
const tagDraft = require('./helper/tag-draft')

// const tagChartFlow = require('./helper/tag-chart-flow')
// const tagChartSequence = require('./helper/tag-chart-sequence')
// const tagChartGantt = require('./helper/tag-chart-gantt')
// const tagSwaggerSpec = require('./helper/tag-swagger-spec')

const expressions = require('./helper/expressions')

const page = (rc, _options, plugins = []) => (title, src) => {
  const slug = slugger.slug(title)
  const toc = markdown(src).toc()
  /*
    Maybe make it possible to set if specific plugin/helper should be part of the markdown
    so some could be traded with markdown on some skipped
  */

  const process = posthtml(
    [
      tagInclude({srcFolder: rc.src_folder}),
      ...plugins,
    ]
  )
  .process(src, {sync: true})

  const html = markdown(process.html).html().contents
  
  return {slug, toc, html}
}

const layout = () => (layoutfile) => (locals) => {
  const p = posthtml()
    .use(expressions(locals))
    .process(layoutfile, {sync: true})

  return p.html
}

module.exports = (rc, options, plugins = []) => {
  return Object.freeze(
    {
      page: page(rc, options, plugins ? plugins : []),
      layout: layout(),
    }
  )
}