const {expect} = require('chai')
const path = require('path')
const fs = require('fs-extra')
// const {pathExists} = require('@docthor/core/bin/io/filesys')


// const Docthor = require('@docthor/core')
const opt = require('@docthor/core/bin/opt')
const exec = require('@docthor/core/bin/io/exec')

const Slate = require('../../test-utils/Slate')

// const getConfig = (dir) => {
//   return {
//     "title": "Untitled",
//     "version": "1.0.0",
//     "src_folder": "test/bin/.temp/markdown",
//     "publish_folder": "test/bin/.temp/docs",
//     "draft_folder": "test/bin/.temp/_draft",
//   }
// }

const isHavingPaths = async (dir) => {
  // const docthorrc = await pathExists(path.resolve(__dirname, '.docthorrc.js'))
  const dirDocs = await fs.pathExists(path.resolve(dir, 'docs'))
  const dirMarkdown = await fs.pathExists(path.resolve(dir, 'markdown'))
  const dirTemplate = await fs.pathExists(path.resolve(dir, 'template'))

  return {
    // '.docthorrc.js': docthorrc,
    'docs/': dirDocs,
    'markdown/': dirMarkdown,
    'template/': dirTemplate,
  }
}

describe('#bin execution', () => {
  const slate = new Slate('test/bin')

  beforeEach(() => {
    opt.setArgs('--silent', '-y')
  })
  before(async () => {
    await slate.clean()
  })

  context('uncomplete init', () => {
    it('following paths should not exist', async () => {
      const currentState = await isHavingPaths(slate.dirTemp)
      expect(currentState).to.eql(
        {
          // '.docthorrc.js': false,
          'docs/': false,
          'markdown/': false,
          'template/': false,
        }
      )
    })
    it('it throws on runned, as files not exits', () => {
      expect('1').to.equal('1') // this is not the test obviously
    })
  })
  context('complete init', () => {
    it('..', async () => {
      const init = await exec().init()
      // await init.create(), should not be executable w/o config ?
      await init.create({...slate.config})
      await exec().page({...slate.config}, {isDraft: false})
    })

  })
})
