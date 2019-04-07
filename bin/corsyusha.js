#!/usr/bin/env node

'use strict'

require('dotenv').config()

const args = require('command-line-args')
const detectPort = require('detect-port')

const corsyusha = require('../lib')


const defaltArgs = [
  {
    name: 'url',
    alias: 'u',
    type: String,
    defaultValue: process.env.CORSYUSHA_URL,
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: process.env.CORSYUSHA_PORT,
  },
  {
    name: 'host',
    alias: 'h',
    type: String,
    defaultValue: process.env.CORSYUSHA_HOST,
  },
  {
    name: 'urlSection',
    alias: 's',
    type: String,
    defaultValue: process.env.CORSYUSHA_URL_SECTION,
  },
  {
    name: 'serverLogging',
    alias: 'l',
    type: String,
    defaultValue: process.env.CORSYUSHA_SERVER_LOGGING,
  },
]

const main = async () => {

  try {
    const {
      url,
      port,
      host,
      urlSection,
      serverLogging,
    } = args(defaltArgs)

    if (! url) {
      throw new Error('--url is required!')
    }

    const availablePort = await detectPort(port)

    if (availablePort.toString() !== port.toString()) {
      throw new Error(`--port ${port} was occupied, try port: ${availablePort}`)
    }

    const normalizedServerLogging = ['', 'true', '1', 'yes', true, 1].includes(serverLogging)

    await corsyusha({
      url,
      port,
      host,
      urlSection,
      serverLogging: normalizedServerLogging,
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

}

main()
