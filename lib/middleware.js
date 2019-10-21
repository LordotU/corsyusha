'use strict'

const request = require('request')


module.exports = ({
  logger,
  cleanUrl,
  headers,
  origin,
  reflectOrigin,
} = {}) => (req, res, next) => {

  const requestUrl = `${cleanUrl}${req.url}`

  try {

    if (typeof headers === 'object') {
      const normalizedHeaders = Object.keys(headers).reduce((result, h) => ({
        ...result,
        [h.toLowerCase()]: headers[h],
      }), {})

      req.headers = {
        ...normalizedHeaders,
        ...req.headers,
      }
    }

    logger.info(`${'Proxied request merged headers'.blue} ${JSON.stringify(req.headers).green}`)

    res.setHeader('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    res.setHeader('access-control-allow-credentials', 'true')

    if (reflectOrigin) {
      res.setHeader('access-control-allow-origin', req.headers.origin)
      res.setHeader('vary', 'Origin')
    } else if (!! origin) {
      res.setHeader('access-control-allow-origin', origin)
      res.setHeader('Vary', 'Origin')
    } else {
      res.setHeader('access-control-allow-origin', '*')
      res.setHeader('Vary', '*')
    }

    if (req.method === 'OPTIONS') {
      const accessControlRequestHeaders = req.headers['access-control-request-headers']

      if (!! accessControlRequestHeaders) {
        res.setHeader('access-control-allow-headers', accessControlRequestHeaders)
      }

      res.setHeader('content-length', 0)
      res.writeHead(204)
    }

    req.pipe(request(requestUrl)).pipe(res)

    logger.info(`${req.method.magenta} ${'request proxied:'.blue} ${req.url.green} ${'->'.blue} ${requestUrl.green}`)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}
