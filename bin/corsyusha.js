#!/usr/bin/env node

'use strict'

require('dotenv').config()

const args = require('command-line-args')
const detectPort = require('detect-port')

const corsyusha = require('../lib')


const defaultArgs = [
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
  {
    name: 'headers',
    type: String,
    defaultValue: process.env.CORSYUSHA_HEADERS,
  },
  {
    name: 'origin',
    alias: 'o',
    type: String,
    defaultValue: process.env.CORSYUSHA_ORIGIN,
  },
  {
    name: 'reflectOrigin',
    alias: 'r',
    type: Boolean,
    defaultValue: process.env.CORSYUSHA_REFLECT_ORIGIN,
  },
]

const isBooleanTrue = val => [null, 'true', '1', 'yes', true, 1].includes(val)

const main = async () => {

  try {
    const {
      url,
      port,
      host,
      urlSection,
      serverLogging,
      headers,
      origin,
      reflectOrigin,
    } = args(defaultArgs)

    if (! url) {
      throw new Error('--url is required!')
    }

    const availablePort = await detectPort(port)

    if (availablePort.toString() !== port.toString()) {
      throw new Error(`--port ${port} was occupied, try port: ${availablePort}`)
    }

    const normalizedServerLogging = isBooleanTrue(serverLogging)

    const parsedHeaders = JSON.parse(headers)

    const normalizedReflectOrigin = isBooleanTrue(reflectOrigin)

    await corsyusha({
      url,
      port,
      host,
      urlSection,
      serverLogging: normalizedServerLogging,
      headers: parsedHeaders,
      origin,
      reflectOrigin: normalizedReflectOrigin,
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

}

main()
