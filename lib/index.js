'use strict'

require('colors')

const fastify = require('fastify')
const fastifyCors = require('fastify-cors')

const middleware = require('./middleware')


module.exports = async ({
  url,
  port,
  host,
  urlSection,
  serverLogging,
  headers,
} = {}) => {
  const proxy = fastify(serverLogging ? {
    logger: {
      prettyPrint: true,
    },
  } : {})

  const cleanUrl = url.replace(/\/$/, '')
  const cleanUrlSection = urlSection.replace(/^\//g, '')
  const logger = serverLogging ? proxy.log : console

  proxy.register(fastifyCors, {
    origin: '*',
  })

  proxy.use(`/${cleanUrlSection}`, middleware({
    logger,
    cleanUrl,
    headers,
  }))

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
    `http://${host}:${port}/${cleanUrlSection}`.yellow.bold,
  )
  console.log('\n')

  return proxy
}
