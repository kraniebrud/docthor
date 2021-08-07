const {readFileSync, readdirSync, writeFileSync} = require('./filesys')
const {HOME_DIR, PACKAGE_NAME} = require('./constants')
const render = require('./render/functions')

class Page {
  constructor (cfg, options = {}) {
    Object.assign(this, {cfg, options})
  }
  static createPage (cfg, options, pageIdx, fromPath, filename, plugins) {
    let fname = filename.substr(0, filename.length - 3).trim() // Minus `.md`-extension
    let orderNoPrefix = parseInt(fname.substr(0, 2)) // ie. `01 About.md`, where 01 is order no, must match this pattern when using page orders (page index)
    let title = fname.replace('.draft', '')
    if(!isNaN(orderNoPrefix)) { // it has a order prefix
      title = title.substr(2, title.length).trim()
    }
    if(pageIdx == 0) {
      fname = 'index'
    }
    fname = fname.toLowerCase().replace('.draft', '-draft')
    const content = readFileSync(`${fromPath}/${filename}`)
    return {title, ...render(cfg, options, plugins).page(fname, content)}
  }
  createPages (plugins) {
    const {cfg, options} = this
    const [templateDir, wikiDir] = [
      `${HOME_DIR}/${PACKAGE_NAME}/template/${cfg.template || 'default' /* figure how template should be work */ }/_src/html`,
      `${HOME_DIR}/${cfg.src_folder}`
    ]
    const outFolder = options.isDraft ? cfg.draft_folder : cfg.publish_folder
    const layoutfile = readFileSync(`${templateDir}/layout.html`)
    const filesInDir = readdirSync(wikiDir)
    const pages = filesInDir.map((f, idx) => {
      const [notMd, isDraftMd] = [
        f.substr(f.length - '.md'.length) !== '.md',
        f.substr(f.length - '.draft.md'.length) === '.draft.md'
      ]
      return notMd || (options.isDraft === false && isDraftMd) ? false : { // < must be md-file, when NOT draft must NOT be draft md
        ...Page.createPage(cfg, options, idx, wikiDir, f, plugins)
      }
    })
    .filter(pfilter => pfilter) // filter for removing false entries
    const pageLinks = pages.map(
      item => ({
        title: item.title,
        href: `${item.slug}.html`,
      })
    )
    let createdFiles = []
    for(let p of pages.filter(pfilter => pfilter)) {
      let html = render().layout(layoutfile)(
        {
          project: {title: cfg.title, version: this.cfg.version},
          pages: pageLinks,
          page: p,
        }
      )
      let createFile = `${HOME_DIR}/${outFolder}/${p.slug}.html`.replace('//', '/')
      writeFileSync(createFile, html)
      createdFiles.push(createFile)
    }
    return createdFiles
  }
}

module.exports = Page