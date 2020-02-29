/*
  A library for interacting with fullstack.cash and JWT API token handling
  for bch-api.
*/

'use strict'

// Load the configuration settings.
const config = require('./config')

// Instantiate bch-js SDK for working with Bitcoin Cash.
const BCHJS = require('@chris.troutner/bch-js')
let bchjs = new BCHJS({
  restURL: config.APISERVER,
  apiToken: config.BCHJSTOKEN
})

// Library for tracking the state of this app.
const State = require('./src/state')
const state = new State()

const FullStack = require('./src/fullstack')
const fullstack = new FullStack()

let stateData

// The BCH address this app is monitoring.
const address = 'bitcoincash:qr8wlllpll7cgjtav9qt7zuqtj9ldw49jc8evqxf5x'

// This is a one-time function used to initalize the app at startup.
async function startup () {
  try {
    stateData = await state.readState()
    console.log(`The apps current state: ${JSON.stringify(stateData, null, 2)}`)
    console.log(' ')

    const apiToken = await fullstack.getApiToken(stateData)
    // console.log(`apiToken: ${JSON.stringify(apiToken, null, 2)}`)

    // Save the state.
    stateData.apiToken = apiToken
    await state.writeState(stateData)

    // Instantiate bch-js with the API token.
    bchjs = new BCHJS({ restURL: config.APISERVER, apiToken: apiToken })

    // Start a timer that periodically checks the balance of the app.
    // Also start a timer that runs the main app every 10 seconds.
    setInterval(function () {
      try {
        checkBalance()
      } catch (err) {
        console.log('Error: ', err)
      }
    }, 10000) // 10 seconds

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
    // console.log(`bchjs.apiToken: ${bchjs.apiToken}`)

    // Calculate the real balance.
    const realBalance =
      Number(balance.balance) + Number(balance.unconfirmedBalance)

    // Generate a timestamp.
    let now = new Date()
    now = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })

    console.log(`Balance: ${realBalance} satoshis at ${now}`)
    console.log(' ')
  } catch (err) {
    console.error('Error in checkBalance()')
    throw err
  }
}

// Execut the main app by running the startup function.
startup()
