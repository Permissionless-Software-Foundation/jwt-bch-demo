/*
  A library for interacting with fullstack.cash and JWT API token handling
  for bch-js.

  This app can be used as a boilerplate for starting new apps that interact
  with the BCH blockchain.
*/

'use strict'

// Load the configuration settings.
const config = require('./config')

// Instantiate bch-js SDK for working with Bitcoin Cash.
const BCHJS = require('@chris.troutner/bch-js')
let bchjs = new BCHJS()

// Instantiate the JWT handling library for FullStack.cash.
const JwtLib = require('jwt-bch-lib')
const jwtLib = new JwtLib({
  // Overwrite default values with the values in the config file.
  server: config.AUTHSERVER,
  login: config.FULLSTACKLOGIN,
  password: config.FULLSTACKPASS
})

// The BCH address this app is monitoring.
const address = 'bitcoincash:qr8wlllpll7cgjtav9qt7zuqtj9ldw49jc8evqxf5x'

// startup() starts the app.
// This is a one-time function used to initalize the app at startup. It registers
// with the auth.fullstack.cash server and retrieves a valid API JWT token.
async function startup () {
  try {
    // This variable will hold the JWT token.
    let apiToken = ''

    try {
      // Log into the auth server.
      await jwtLib.register()

      apiToken = jwtLib.userData.apiToken
      console.log(`Retrieved JWT token: ${apiToken}\n`)

      // Ensure the JWT token is valid to use.
      const isValid = await jwtLib.validateApiToken()

      // Get a new token with the same API level, if the existing token is not
      // valid (probably expired).
      if (!isValid.isValid) {
        apiToken = await jwtLib.getApiToken(jwtLib.userData.apiLevel)
        console.log(`The JWT token was not valid. Retrieved new JWT token: ${apiToken}\n`)
      } else {
        console.log('JWT token is valid.\n')
      }
    } catch (err) {
      console.error('Error trying to log into auth.fullstack.cash and retrieve JWT token.')
      throw err
    }

    // Re-instantiate bch-js with the API token.
    bchjs = new BCHJS({ restURL: config.APISERVER, apiToken: apiToken })

    // Start a timer that periodically checks the balance of the app.
    // Also start a timer that runs the main app every 10 seconds.
    setInterval(function () {
      try {
        checkBalance()
      } catch (err) {
        console.log('Error: ', err)
      }
    }, 3000) // 3 seconds

    // Also check the balance immediately.
    checkBalance()
  } catch (err) {
    console.error('Error in startup()')
    throw err
  }
}

// Check the balance of this apps BCH address.
async function checkBalance () {
  try {
    // Get the balance for the address from the indexer.
    const balance = await bchjs.Blockbook.balance(address)
    // console.log(`balance: ${JSON.stringify(balance, null, 2)}`)

    // Calculate the real balance.
    const realBalance =
      Number(balance.balance) + Number(balance.unconfirmedBalance)

    // Generate a timestamp.
    let now = new Date()
    now = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })

    console.log(`Balance: ${realBalance} satoshis at ${now}`)
    console.log(' ')
  } catch (err) {
    console.error('Error in checkBalance(): ', err)
    console.log(' ')
  }
}

// Execut the main app by running the startup function.
startup()
