/**
 * opt is one trick pony. once set should not be modified.
 * thus not object assigned, it is the runtime initiate "truth"
 */

let $command
let $args = []

module.exports.setCommand = (command) => {
  $command = command
}

module.exports.getCommand = () => {
  return $command
}

module.exports.setArgs = (...args) => {
  $args = args.flat()
}

module.exports.getArgs = () => {
  return [ ...$args ]
}
