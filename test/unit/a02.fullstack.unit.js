/*
  Unit tests for the Fullstack.cash library.
*/

const assert = require('chai').assert
const sinon = require('sinon')

const FullStack = require('../../src/fullstack')

const mockData = require('./mocks/fullstack.mocks')

// const config = {
//   login: 'test@test.com',
//   password: 'test'
// }

describe('#fullstack.js', () => {
  let sandbox
  let uut

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new FullStack()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should create a new instance', () => {
      assert.property(uut, 'config')
      assert.property(uut, 'state')
    })
  })

  describe('#requestNewToken', () => {
    it('should return an API token', async () => {
      // Stub network calls so that it doesn't make any live calls.
      sandbox.stub(uut.jwtLib, 'updateCredit').resolves({})
      sandbox.stub(uut.jwtLib, 'getApiToken').resolves({ apiToken: 'test-token' })

      const result = await uut.requestNewToken(10)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result, 'test-token')
    })

    it('should catch and throw any error', async () => {
      try {
        sandbox.stub(uut.jwtLib, 'updateCredit').throws(new Error('test'))

        await uut.requestNewToken(10)

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'test')
      }
    })
  })

  describe('#reinitialize', () => {
    it('should reininstantiate the jwt-bch-lib library', () => {
      const testState = {
        login: 'demo@demo.com',
        password: 'demo',
        apiToken: ''
      }

      uut.reinitialize(testState)

      // console.log(`uut.jwtLib: ${JSON.stringify(uut.jwtLib, null, 2)}`)

      assert.property(uut.jwtLib, 'axiosOptions')
    })
  })

  describe('#getApiToken', () => {
    it('should get an API Token', async () => {
      // Use mocks to prevent live network calls.
      sandbox.stub(uut, 'reinitialize').returns()
      sandbox.stub(uut.jwtLib, 'register').resolves(true)
      sandbox.stub(uut.jwtLib, 'validateApiToken').resolves(true)

      uut.jwtLib.userData = mockData.mockUserData

      const testState = {
        login: 'demo@demo.com',
        password: 'demo',
        apiToken: ''
      }

      const result = await uut.getApiToken(testState)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result)
    })
  })
})
