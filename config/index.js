/*
  Global configuration options.
  A convenient place to set frequently-used values.

  This file makes use of the JavaScript shorthand:
  <variable>: <statement> ? <value if true> : <value if false>

  The shorthand allows default values to be overwriten by POSIX environment
  variables. These are used in all major operating systems.
*/

const config = {
  AUTHSERVER: process.env.AUTHSERVER ? process.env.AUTHSERVER : 'https://auth.fullstack.cash',
  APISERVER: process.env.APISERVER ? process.env.APISERVER : 'https://api.fullstack.cash/v3/',
  BCHJSTOKEN: process.env.BCHJSTOKEN ? process.env.BCHJSTOKEN : '',
  stateFileName: 'state.json',
  FULLSTACKLOGIN: process.env.FULLSTACKLOGIN ? process.env.FULLSTACKLOGIN : 'demo@demo.com',
  FULLSTACKPASS: process.env.FULLSTACKPASS ? process.env.FULLSTACKPASS : 'demo'
}

config.stateFilePath = `${__dirname}/${config.stateFileName}`
// console.log(`stateFilePath: ${config.stateFilePath}`)

module.exports = config
