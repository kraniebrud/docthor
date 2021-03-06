const {readFileSync, readdirSync, writeFileSync} = require('./filesys')
const {HOME_DIR, PACKAGE_NAME} = require('./constants')
const render = require('./render/functions')

class Wiki {
  constructor (rc, options) {
    Object.assign(this, {rc, options})
  }
  static createPage (rc, options, pageIdx, fromPath, filename) {
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
    return {title, ...render(rc, options).page(fname, content)}
  }
  create () {
    const {rc, options} = this
    const [templateDir, wikiDir] = [
      `${HOME_DIR}/${PACKAGE_NAME}/template/${rc.template}/_src/html`,
      `${HOME_DIR}/${rc.src_folder}`
    ]
    const outFolder = options.isDraft ? rc.draft_folder : rc.publish_folder
    const layoutfile = readFileSync(`${templateDir}/layout.html`)
    const filesInDir = readdirSync(wikiDir)
    const pages = filesInDir.map((f, idx) => {
      const [notMd, isDraftMd] = [
        f.substr(f.length - '.md'.length) !== '.md',
        f.substr(f.length - '.draft.md'.length) === '.draft.md'
      ]
      return notMd || (options.isDraft === false && isDraftMd) ? false : { // < must be md-file, when NOT draft must NOT be draft md
        ...Wiki.createPage(rc, options, idx, wikiDir, f)
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
          project: {title: rc.title, version: this.rc.version},
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

module.exports = Wiki