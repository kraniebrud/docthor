const {log, info, warn, trace} = require('better-console')
const {createInterface} = require('readline')
const availableColors = require('./colors')


const paint = (...colors) => (content) => {
  const pick = (pColor) => availableColors[pColor] || ''
  const useColors = colors.reduce((acc, curr) => acc + pick(curr), '')
  return `${useColors}${content}${pick('reset')}`
}

const interface = createInterface({input: process.stdin, output: process.stdout})

const receive = (which) => new Promise((resolve, reject) => {
  switch(which) {
    case 'title': {
      interface.write('\nWhat title do you want for your documentation?\n')
      return interface.question(
        `${paint('dim')('Left blank results in "Untitled"')} ${paint('cyan')('Title')}: `, resolve
      )
    }
    case 'version': {
      interface.write('\nWhat version should we keep?\n')
      return interface.question(`${paint('dim')('Left blank result in "1.0.0"')} ${paint('cyan')('Version')}: `, resolve)
    }
    case 'src_folder': {
      interface.write('\nFrom which folder should we retrieve the markdown (src) files from?\n')
      return interface.question(`${paint('dim')('Left blank result in "markdown"')} ${paint('cyan')('Src folder')}: `, resolve)
    }
    case 'publish_folder': {
      interface.write('\nWhere should we place the generated (publish) files?\n')
      return interface.question(`${paint('dim')('Left blank result in "docs"')} ${paint('cyan')('Publish folder')}: `, resolve)
    }
    case 'draft_folder': {
      interface.write('\nWhere should we place the generated (draft) files?\n')
      return interface.question(`${paint('dim')('Left blank result in "_draft"')} ${paint('cyan')('Draft folder')}: `, resolve)
    }
    case 'rc_accept_dialog': {
      return interface.question(`${paint('dim')('yes(y)/no(n)')} ${paint('cyan', 'blink')('continue?')}: `, resolve)
    }
  }
  reject(`CLI ERR: Uknown prompt question received, question "${which}"`)
})

exports.prompt = async (...questions) => {
  const answers = []
  try {
    for(let question of questions) answers.push(
      await receive(question)
    )
  }
  catch(err) {
    trace(err)
    process.exit(1)
  }
  return answers
}

exports.paint = paint
exports.interface = interface