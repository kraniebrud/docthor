const exec = require('./io/exec')
const {info, warn} = require('better-console')
const {paint, interface, prompt} = require('./cmd/interact')
const {argv} = process
const args = argv.splice(2) // leave out 1st and 2nd arg, is always refered to where node is executed from and path of executed node script
const command = args[0]

;(async () => {
  switch(command || '') {
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

        const [title, version, src_folder, publish_folder, draft_folder] = [
          inputTitle && inputTitle.length > 0 ? inputTitle : 'Untitled',
          inputVersion && inputVersion.length > 0 ? inputVersion : '1.0.0',
          inputSrcFolder && inputSrcFolder.length > 0 ? inputSrcFolder : 'markdown',
          inputPublishFolder && inputPublishFolder.length > 0 ? inputPublishFolder : 'docs',
          inputDraftFolder && inputDraftFolder.length > 0 ? inputDraftFolder : '_draft',
        ]

        interface.write('\nContinue with theese settings?')
        interface.write(`\n${paint('blue')('Title')}\t\t\t${title}`)
        interface.write(`\n${paint('blue')('Version')}\t\t\t${version}`)
        interface.write(`\n${paint('blue')('Src folder')}\t\t${src_folder}`)
        interface.write(`\n${paint('blue')('Publish folder')}\t\t${publish_folder}`)
        interface.write(`\n${paint('blue')('Draft folder')}\t\t${draft_folder}\n`)

        const [continueAnswer] = await prompt('rc_accept_dialog')
        const accepted = continueAnswer.substring(0, 1).toLowerCase() === 'y'
        if(accepted) await init.create({title, version, src_folder, publish_folder, draft_folder}) // initial
        process.exit(0)
      }
      catch(err) {
        interface.write(`${paint('red')(err)}`)
      }
      process.exit(0)
    }
    case 'build': {
      try {
        await exec().wiki({isDraft: false})
      }
      catch(err) {
        interface.write(`${paint('red')(err)}`)
      }
      return 
    } 
    case 'draft': {
      try {
        await exec().wiki({isDraft: true})
      }
      catch (err) {
        interface.write(`${paint('red')(err)}`)
      }
      return 
    }
    case 'create:swagger': {
      const [name, url] = [args[1], args[2]]
      const resolvedUrl = url && url.startsWith('http://') && url.endsWith('/swagger.json')
      const resolvedName = name && /^[A-Za-z0-9]+([-][A-Za-z0-9]+)*$/.test(name)
      if(!resolvedName) return interface.write(
        name 
          ? `Could not solve name "${name}"` 
          : 'Please supply with name'
      )
      if(!resolvedUrl) return interface.write(
        url 
          ? `Could not solve url "${url}". It must start with "http(s)://" and end with "/swagger.json"` 
          : 'Please supply url for your swagger.json file. Example "http(s)://foo.bar/swagger.json"'
      )

      await exec().resource().createSwagger({name, url})
      interface.write(`swagger spec ${name} has been added to resources`)
      process.exit(0)
    }
    default : {
      warn(`Uknown command ${command}`)
      process.exit(0)
    }
  }
  process.exit(0)
})()