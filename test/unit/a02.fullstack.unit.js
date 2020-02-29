/*
  Mocha unit tests for the state library.
*/

const assert = require('chai').assert
const sinon = require('sinon')

// const mockData = require('./mocks/jwt-bch-api.mocks')

// const config = {
//   login: 'test@test.com',
//   password: 'test'
// }

describe('#test', () => {
  let sandbox
  // let uut

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should test something', () => {
      assert(true, true)
    })
  })
})
