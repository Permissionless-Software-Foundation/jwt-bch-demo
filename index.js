/*
  A library for interacting with fullstack.cash and JWT API token handling
  for bch-js.

  This app can be used as a boilerplate for starting new apps that interact
  with the BCH blockchain.
*/

'use strict'

// Load the configuration settings.
const config = require('./config')

// Load the utility library.
const FullStackJWT = require('./lib/fullstack-jwt')
const fullStackJwt = new FullStackJWT({
  server: config.AUTHSERVER,
  login: config.FULLSTACKLOGIN,
  password: config.FULLSTACKPASS
})

// Instantiate bch-js SDK for working with Bitcoin Cash.
const BCHJS = require('@psf/bch-js')
let bchjs = new BCHJS()

// The BCH address this app is monitoring.
const address = 'bitcoincash:qr8wlllpll7cgjtav9qt7zuqtj9ldw49jc8evqxf5x'

// startup() starts the app.
// This is a one-time function used to initalize the app at startup. It registers
// with the auth.fullstack.cash server and retrieves a valid API JWT token.
async function startup () {
  try {
    const apiToken = await fullStackJwt.getJWT()

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
    console.log(err.message)
    throw err
  }
}

// Check the balance of this apps BCH address.
// This is an example of some blockchain-focused business logic used in your
// own app.
async function checkBalance () {
  try {
    // Get the balance for the address from the indexer.
    const balanceResult = await bchjs.Electrumx.balance(address)
    if (!balanceResult.success) {
      throw new Error('Error getting bch balance')
    }
    // console.log(`balanceResult: ${JSON.stringify(balanceResult, null, 2)}`)
    const balance = balanceResult.balance
    // Calculate the real balance.
    const realBalance = Number(balance.confirmed) + Number(balance.unconfirmed)

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

// Execute the main app by running the startup function.
startup()
