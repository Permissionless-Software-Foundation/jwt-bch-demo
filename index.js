/*
  A library for interacting with fullstack.cash and JWT API token handling
  for bch-api.
*/

'use strict'

// Load the configuration settings.
const config = require('./config')

// Instantiate bch-js SDK for working with Bitcoin Cash.
const BCHJS = require('@chris.troutner/bch-js')
const bchjs = new BCHJS({ restURL: config.APISERVER, apiToken: config.BCHJSTOKEN })

// The BCH address this app is monitoring.
const address = 'bitcoincash:qr8wlllpll7cgjtav9qt7zuqtj9ldw49jc8evqxf5x'

// Define the main program.
async function mainApp () {
  try {
    // Get the balance for the address from the indexer.
    const balance = await bchjs.Blockbook.balance(address)
    // console.log(`balance: ${JSON.stringify(balance, null, 2)}`)
    console.log(`bchjs.apiToken: ${bchjs.apiToken}`)

    // Calculate the real balance.
    const realBalance = Number(balance.balance) + Number(balance.unconfirmedBalance)

    // Generate a timestamp.
    let now = new Date()
    now = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })

    console.log(`Balance: ${realBalance} satoshis at ${now}`)
    console.log(' ')
  } catch (err) {
    console.log('Error in the main app: ', err)
  }
}

// Execut the main app.
mainApp()

// Also start a timer that runs the main app every 10 seconds.
setInterval(function () {
  mainApp()
}, 10000) // 10 seconds
