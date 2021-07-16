/*
  A library of utility functions for working with FullStack.cash JWT tokens.

  Feel free to copy this library into your own app, as well as the unit tests
  for this file.
*/

const JwtLib = require('jwt-bch-lib')

class FullStackJWT {
  constructor (localConfig = {}) {
    // Input Validation
    this.server = localConfig.server
    if (!this.server || typeof this.server !== 'string') {
      throw new Error(
        'Must pass a url for the server when instantiating FullStackJWT class.'
      )
    }
    this.login = localConfig.login
    if (!this.login || typeof this.login !== 'string') {
      throw new Error(
        'Must pass a FullStack.cash login (email) instantiating FullStackJWT class.'
      )
    }
    this.password = localConfig.password
    if (!this.password || typeof this.password !== 'string') {
      throw new Error(
        'Must pass a FullStack.cash account password when instantiating FullStackJWT class.'
      )
    }

    // Encapsulate dependencies
    this.jwtLib = new JwtLib({
      // Overwrite default values with the values in the config file.
      server: this.server,
      login: this.login,
      password: this.password
    })

    // State
    this.apiToken = '' // Default value.
  }

  // Get's a JWT token from FullStack.cash.
  async getJWT () {
    try {
      // Log into the auth server.
      await this.jwtLib.register()

      this.apiToken = this.jwtLib.userData.apiToken
      if (!this.apiToken) {
        throw new Error('This account does not have a JWT')
      }
      console.log(`Retrieved JWT token: ${this.apiToken}\n`)

      // Ensure the JWT token is valid to use.
      const isValid = await this.jwtLib.validateApiToken()

      // Get a new token with the same API level, if the existing token is not
      // valid (probably expired).
      if (!isValid.isValid) {
        this.apiToken = await this.jwtLib.getApiToken(
          this.jwtLib.userData.apiLevel
        )
        console.log(
          `The JWT token was not valid. Retrieved new JWT token: ${this.apiToken}\n`
        )
      } else {
        console.log('JWT token is valid.\n')
      }

      return this.apiToken
    } catch (err) {
      console.error(
        `Error trying to log into ${this.server} and retrieve JWT token.`
      )
      throw err
    }
  }
}

module.exports = FullStackJWT
