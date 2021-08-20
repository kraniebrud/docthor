const opt = require('./opt')
const run = require('./run')

const argsOffset = process.argv.splice(2) // leave out 1st and 2nd arg, is always refered to where node is executed from and path of executed node script
const [command, ...args] = argsOffset

;(async () => {
  opt.setCommand(command)
  opt.setArgs(args)
  await run()
})()
