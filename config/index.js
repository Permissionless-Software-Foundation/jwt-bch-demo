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
  FULLSTACKLOGIN: process.env.FULLSTACKLOGIN ? process.env.FULLSTACKLOGIN : 'demo@demo.com',
  FULLSTACKPASS: process.env.FULLSTACKPASS ? process.env.FULLSTACKPASS : 'demo',
  apiLevel: 10 // Tier of access: 10 = free, 20 = full node, 30 = indexer, 40 = SLP
}

module.exports = config
