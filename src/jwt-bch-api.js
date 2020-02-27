/*
  This library contains methods for interacting with the jwt-bch-api, targeting
  the implementation at fullstack.cash.
*/

'use strict'

const axios = require('axios')
const config = require('../config')

let _this

class JwtBchApi {
  constructor (config) {
    try {
      _this = this
      this.userData = {
        hasRegistered: false
      }

      if (!config.login) {
        throw new Error(
          'No login email provided. You must initialize jwt-bch-api with login for fullstack.cash.'
        )
      }
      _this.login = config.login

      if (!config.password) {
        throw new Error(
          'No password provided. You must initialize jwt-bch-api with login for fullstack.cash.'
        )
      }
      _this.password = config.password

      this.axios = axios

      // Axios Option template.
      this.axiosOptions = {
        timeout: 15000,
        responseType: 'json'
      }
    } catch (err) {
      console.error('Error in jwt-bch-api.js/constructor()')
      throw err
    }
  }

  // register with the JWT server by logging in, populate the userData.
  // This must be called before any of the other methods in this library.
  async register () {
    try {
      const options = this.axiosOptions
      options.method = 'post'
      options.url = `${config.SERVER}/auth`
      options.data = {
        email: _this.login,
        password: _this.password
      }

      const result = await _this.axios.request(options)
      // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

      // Populate local data from the server response.
      _this.userData.apiLevel = result.data.user.apiLevel
      _this.userData.rateLimit = result.data.user.rateLimit
      _this.userData.userId = result.data.user._id
      _this.userData.userEmail = result.data.user.email
      _this.userData.bchAddr = result.data.user.bchAddr

      // Access token is the JWT token used to work with auth.fullstack.cash.
      _this.userData.accessToken = result.data.token

      // API token is the JWT token used to work with api.fullstack.cash.
      _this.userData.apiToken = result.data.user.apiToken

      // Set the flag to indicate that the user has registered.
      _this.userData.hasRegistered = true

      return true
    } catch (err) {
      console.error('Error in jwt-bch-api.js/register()')
      throw err
    }
  }

  // Request a new API token for the specified API access tier.
  async getApiToken (apiLevel) {
    try {
      if (isNaN(Number(apiLevel))) {
        throw new Error('apiLevel must be a positive integer.')
      }

      const options = this.axiosOptions
      options.method = 'post'
      options.url = `${config.SERVER}/apitoken/new`
      options.data = {
        apiLevel: apiLevel
      }
      options.headers = {
        Authorization: `Bearer ${_this.userData.accessToken}`
      }

      const result = await _this.axios.request(options)
      // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

      // Update the state.
      _this.userData.apiLevel = result.data.apiLevel
      _this.userData.apiToken = result.data.apiToken

      return result.data
    } catch (err) {
      console.error('Error in jwt-bch-api.js/getApiToken()')
      throw err
    }
  }

  // Ask the Auth server to validate the API token and determine if it's still
  // valid, or if it has expired or been invalidated for some other reason.
  async validateApiToken () {
    try {
      const options = this.axiosOptions
      options.method = 'post'
      options.url = `${config.SERVER}/apitoken/isvalid`
      options.data = {
        token: _this.userData.apiToken
      }
      options.headers = {
        Authorization: `Bearer ${_this.userData.accessToken}`
      }

      const result = await _this.axios.request(options)
      // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

      return result.data
    } catch (err) {
      console.error('Error in jwt-bch-api.js/validateApiToken()')
      throw err
    }
  }

  // Return the BCH address associated with the registered user.
  getBchAddr () {
    return _this.userData.bchAddr
  }

  // Ask the server to check the assigned BCH address and update credit.
  async updateCredit () {
    try {
      const options = this.axiosOptions
      options.method = 'get'
      options.url = `${config.SERVER}/apitoken/update-credit/${_this.userData.userId}`
      // options.data = {
      //   token: _this.userData.apiToken
      // }
      options.headers = {
        Authorization: `Bearer ${_this.userData.accessToken}`
      }

      const result = await _this.axios.request(options)
      // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

      return result.data
    } catch (err) {
      console.error('Error in jwt-bch-api.js/updateCredit()')
      throw err
    }
  }
}

module.exports = JwtBchApi
