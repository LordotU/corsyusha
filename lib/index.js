'use strict'

require('colors')

const fastify = require('fastify')
const fastifyCors = require('fastify-cors')
const request = require('request')

module.exports = async ({
  url,
  port,
  host,
  urlSection,
  serverLogging,
} = {}) => {
  const proxy = fastify(serverLogging ? {
    logger: {
      prettyPrint: true,
    },
  } : {})

  const cleanUrl = url.replace(/\/$/, '')
  const cleanUrlSection = urlSection.replace(/^\//g, '')
  const logger = serverLogging ? proxy.log : console

  proxy.register(fastifyCors, {})

  proxy.use(`/${cleanUrlSection}`, (req, res) => {
    const requestUrl = `${cleanUrl}${req.url}`

    logger.info(`Request proxied: ${req.url.green} -> ${requestUrl.green}`.blue)

    try {

      req.pipe(request(requestUrl)).pipe(res)

    } catch (error) {
      logger.error(error)

      const statusCode = error.statusCode >= 400 ?
        error.statusCode :
        500

      res.writeHead(statusCode, { 'Content-Type': 'text/plain' })
      res.end(statusCode >= 500 ? 'Internal server error' : error.message)
    }
  })

  try {
    await proxy.listen(port, host)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }

  console.log('\n')
  console.log('Corsyusha is active!'.black.bgWhite.bold.underline)
  console.log('\n')
  console.log(`${'Proxy url'.blue}: ${cleanUrl.green}`)
  console.log(`${'Proxy partial'.blue}: ${cleanUrlSection.green}`)
  console.log(`${'Proxy port'.blue}: ${port.toString().green}`)
  console.log('\n')
  console.log(
    'To start using the proxy simply replace the proxied part of your url with: '.cyan +
    `http://localhost:${port}/${cleanUrlSection}`.bold,
  )
  console.log('\n')

  return proxy
}
