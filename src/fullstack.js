/*
  Utility library contains business logic for interacting with the fullstack.cash
  authentication server. Handles logging in, validating API JWT tokens, and
  getting a new JWT token.
*/

const config = require('../config')

const State = require('./state')
const state = new State()

const JwtLib = require('jwt-bch-lib')
// const jwtLib = new JwtLib()

let _this

class FullStack {
  constructor () {
    _this = this

    _this.config = config
    _this.state = state
    // _this.jwtLib = jwtLib
  }

  // Get an API JWT token for use with bch-js.
  // If the there is no JWT token saved to the state, a new one will be obtained.
  // If there is a JWT token saved to the state, it will be validated.
  // If the saved JWT token is invalid, a new one will attempt to be obtained.
  async getApiToken (stateData) {
    try {
      // console.log(`stateData: ${JSON.stringify(stateData, null, 2)}`)

      _this.jwtLib = new JwtLib(stateData)
      await _this.jwtLib.register()
      console.log(`jwt-bch-lib user data: ${JSON.stringify(_this.jwtLib.userData, null, 2)}`)
      console.log(' ')

      let apiToken = _this.jwtLib.userData.apiToken
      // const bchAddr = _this.jwtLib.userData.bchAddr

      // If there is no token, attempt to get a new free-tier token.
      if (!apiToken) {
        apiToken = await _this.requestNewToken(10)
        return apiToken
      }

      // Validate the exiting token.
      const isValid = await _this.jwtLib.validateApiToken()

      if (!isValid) {
        console.log('Existing API token is not valid. Obtaining a new one.')
        await _this.requestNewToken(10)
      } else {
        console.log('Current API token is valid.')
      }
      console.log(' ')

      // API token exists and is valid.
      return _this.jwtLib.userData.apiToken
    } catch (err) {
      console.error('Error in fullstack.js/getApiToken()')
      throw err
    }
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
