#!/usr/bin/env node

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
    name: 'urlSection',
    alias: 's',
    type: String,
    defaultValue: process.env.CORSYUSHA_URL_SECTION,
  },
]

const main = async () => {

  try {
    const { url, port, urlSection } = args(defaltArgs)

    if (! url) {
      throw new Error('--url is required!')
    }

    const _port = await detectPort(port)

    if (_port.toString() !== port.toString()) {
      throw new Error(`--port ${port} was occupied, try port: ${_port}`)
    }

    corsyusha(url, port, urlSection)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

}

main()
