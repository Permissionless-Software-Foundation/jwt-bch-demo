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
      console.log(`stateData: ${JSON.stringify(stateData, null, 2)}`)

      _this.jwtLib = new JwtLib(stateData)
      await _this.jwtLib.register()
      console.log(`userData: ${JSON.stringify(_this.jwtLib.userData, null, 2)}`)

      return 'jwt token'
    } catch (err) {
      console.error('Error in fullstack.js/getApiToken()')
      throw err
    }
  }
}

module.exports = FullStack
