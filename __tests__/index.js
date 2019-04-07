/* eslint-disable no-undef */

'use strict'

const { exec: childExec } = require('child_process')
const path = require('path')

const mockProcess = require('jest-mock-process')
const request = require('request')
const supertest = require('supertest')

const corsyusha = require('../lib/index.js')

const URL = 'https://licenseapi.herokuapp.com'
const PORT = 8118
const HOST = 'localhost'
const URL_SECTION = '/proxy'

const INITIAL_ARGS = {
  url: URL,
  port: PORT,
  host: HOST,
  urlSection: URL_SECTION,
}

describe('lib', () => {
  let mockStdout
  let proxy

  beforeEach(() => {
    mockStdout = mockProcess.mockProcessStdout()
  })
  afterEach(async () => {
    mockStdout.mockRestore()
    await proxy.close()
  })

  test('server logging should works correctly if corresponding flag are passed', async () => {
    proxy = await corsyusha({
      ...INITIAL_ARGS,
      serverLogging: true,
    })

    await proxy.ready()

    expect(mockStdout).toHaveBeenNthCalledWith(1, expect.stringMatching(/Server listening at/))
  })

  test('all requests besides urlSection should get 404 responses', async () => {
    proxy = await corsyusha(INITIAL_ARGS)

    await proxy.ready()

    const response = await supertest(proxy.server)
      .get('/')
      .expect(404)
      .expect('Content-Type', /json/)

    expect(response.body).toEqual({
      "statusCode": 404,
      "error": "Not Found",
      "message": "Not Found"
    })
  })

  test('all requests through urlSection should be transparently proxied to url', async () => {
    proxy = await corsyusha(INITIAL_ARGS)

    await proxy.ready()

    const responseFromProxy = await supertest(proxy.server)
      .get(`${URL_SECTION}/licenses/mit`)
      .expect(200)
      .expect('Content-Type', /json/)

    const responseFromRequest = await new Promise((resolve, reject) => {
      request(`${URL}/licenses/mit`, (error, response, body) => {
        if (error) {
          return reject(error)
        }
        try {
          resolve(JSON.parse(body))
        } catch (error) {
          reject(error)
        }
      })
    })

    expect(responseFromProxy.body).toEqual(responseFromRequest)
  })
})

const exec = (args = []) => new Promise(resolve => childExec(
  `${path.resolve('./bin/corsyusha.js')} ${args.join(' ')}`,
  { cwd: process.cwd() },
  (error, stdout, stderr) => resolve({
    code: error && error.code ? error.code : 0,
    error,
    stdout,
    stderr,
  })
))

describe('bin', () => {
  test('should not run without --url param', async () => {
    const result = await exec()

    expect(result.code).toBe(1)
    expect(result.stderr).toMatch(/--url is required\!/)
  })

  test('should advise a free port in a case of selected --port is occupied', async () => {
    const proxy = await corsyusha(INITIAL_ARGS)

    await proxy.ready()

    const result = await exec(['--url', URL])

    expect(result.code).toBe(1)
    expect(result.stderr).toMatch(/--port \d+ was occupied/)

    await proxy.close()
  })
})
