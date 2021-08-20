const exec = require('./io/exec')
const {info, warn} = require('better-console')
const {paint, interface, prompt} = require('./cmd/interact')

const opt = require('./opt')

/**
 * 
 * MAYBE NOT HAVE COMMAND AT ALL. DOTHOCR WILL JUST DO INIT AND THEN WE HAVE ARGS
 * so `@dochtor/core --silent -y` eq. init silent no prompting
 */
module.exports = async () => {
  const command = opt.getCommand()

  switch(command || 'init') {
    case 'init': {
      try {
        const init = await exec().init()
        const initText = [
          '',
          'Hi there!',
          'Just a few questions about your setup and then your documentation will be ready',
          'Dont worry you will be able to change theese later',
          '',
        ]
        .join('\n')
  
        interface.write(paint('cyan')(initText))
  
        const [inputTitle, inputVersion, inputSrcFolder, inputPublishFolder, inputDraftFolder] = await prompt(
          'title', 
          'version', 
          'src_folder', 
          'publish_folder',
          'draft_folder'
        )

        const cfg = {
          title: inputTitle?.length > 0 ? inputTitle : 'Untitled',
          version: inputVersion?.length > 0 ? inputVersion : '1.0.0',
          src_folder: inputSrcFolder?.length > 0 ? inputSrcFolder : 'markdown',
          publish_folder: inputPublishFolder?.length > 0 ? inputPublishFolder : 'docs',
          draft_folder: inputDraftFolder?.length > 0 ? inputDraftFolder : '_draft',
        }

        interface.write('\nContinue with theese settings?')
        interface.write(`\n${paint('blue')('Title')}\t\t\t${cfg.title}`)
        interface.write(`\n${paint('blue')('Version')}\t\t\t${cfg.version}`)
        interface.write(`\n${paint('blue')('Src folder')}\t\t${cfg.src_folder}`)
        interface.write(`\n${paint('blue')('Publish folder')}\t\t${cfg.publish_folder}`)
        interface.write(`\n${paint('blue')('Draft folder')}\t\t${cfg.draft_folder}\n`)

        const [continueAnswer] = await prompt('rc_accept_dialog')
        const accepted = continueAnswer.substring(0, 1).toLowerCase() === 'y'
        if(accepted) {
          await init.create(cfg)
          await exec().page(cfg, {isDraft: false})
        }
        process.exit(0)
      }
      catch(err) {
        interface.write(`${paint('red')(err)}`)
      }
      process.exit(0)
    }
    case 'draft': {
      try {
        await exec().page({isDraft: true})
      }
      catch (err) {
        interface.write(`${paint('red')(err)}`)
      }
      return 
    }
    default : {
      warn(`Uknown command ${command}`)
      process.exit(1)
    }
  }
}
