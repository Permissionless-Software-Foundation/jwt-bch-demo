/*
  Utility library contains business logic for interacting with the fullstack.cash
  authentication server. Handles logging in, validating API JWT tokens, and
  getting a new JWT token.
*/

const config = require('../config')

const State = require('./state')
const state = new State()

const JwtLib = require('jwt-bch-lib')

let _this

class FullStack {
  constructor () {
    _this = this

    // Move global variables inside the instance.
    _this.config = config
    _this.state = state
    _this.jwtLib = new JwtLib(state.currentState)
  }

  // Get an API JWT token for use with bch-js.
  // If the there *is no JWT token* saved to the state, a new one will be obtained.
  // If there *is* a JWT token saved to the state, it will be validated.
  // If the saved JWT token is *invalid*, a new one will attempt to be obtained.
  async getApiToken (stateData) {
    try {
      // console.log(`stateData: ${JSON.stringify(stateData, null, 2)}`)

      // Instantiate the jwt-bch-lib library.
      _this.reinitialize(stateData)

      // Login to auth.fullstack.cash.
      await _this.jwtLib.register()

      // Display the details retrieved from the server.
      console.log(
        `jwt-bch-lib user data: ${JSON.stringify(
          _this.jwtLib.userData,
          null,
          2
        )}`
      )
      console.log(' ')

      // Pull out the current API JWT token.
      let apiToken = _this.jwtLib.userData.apiToken
      // const bchAddr = _this.jwtLib.userData.bchAddr

      // If there is no token, attempt to get a new free-tier token.
      if (!apiToken) {
        apiToken = await _this.requestNewToken(_this.config.apiLevel)
        return apiToken
      }

      // Validate the exiting token.
      const isValid = await _this.jwtLib.validateApiToken()

      // If the current token is not valid, attempt to request a new one.
      if (!isValid) {
        console.log('Existing API token is not valid. Obtaining a new one.')
        await _this.requestNewToken(_this.config.apiLevel)
      } else {
        console.log('Current API token is valid.')
      }
      console.log(' ')

      // API token exists and is valid. Return it.
      return _this.jwtLib.userData.apiToken
    } catch (err) {
      console.error('Error in fullstack.js/getApiToken()')
      throw err
    }
  }

  // Reinitializes the local instance of the jwt-bch-lib.
  reinitialize (stateData) {
    _this.jwtLib = new JwtLib(stateData)
  }

  // Update the credit for this account, then request a new API token at the
  // apiLevel.
  async requestNewToken (apiLevel) {
    try {
      // Ask the auth server to update the credit for this apps account.
      await _this.jwtLib.updateCredit()

      // Request a new API token
      const result = await _this.jwtLib.getApiToken(apiLevel)

      return result.apiToken
    } catch (err) {
      console.error('Error in fullstack.js/requestNewToken()')
      throw err
    }
  }
}

module.exports = FullStack
