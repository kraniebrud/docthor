const {warn} = require('better-console')
const mtoc = require('mdast-util-toc')
const remark = require('remark')
const remark2html = require('remark-html')
const remark2rehype = require('remark-rehype')
const raw = require('rehype-raw')
const rehypeSlug = require('rehype-slug')
const link = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const rehype2html = require('rehype-stringify')

module.exports = (markdown) => Object.freeze(
  {
    toc: (src = markdown) => {
      const mdast = remark().parse(src)
      const tocNode = mtoc(mdast, {tight: true})
      return remark(src)
        .use(remark2html)
        .stringify(tocNode.map)
    },
    content: (src = markdown) => {
      return remark()
        .use(remark2rehype, {allowDangerousHTML: true}) // allowDangerousHTML let's make use of html
        .use(raw)
        .use(rehypeSlug)
        .use(link, {behaviour: 'append'})
        .use(highlight)
        .use(rehype2html)
        .processSync(src)
    }
  }
)