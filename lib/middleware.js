'use strict'

const request = require('request')


module.exports = ({
  logger,
  cleanUrl,
  headers,
} = {}) => (req, res, next) => {

  const requestUrl = `${cleanUrl}${req.url}`

  logger.info(`${req.method.magenta} ${'request proxied:'.blue} ${req.url.green} ${'->'.blue} ${requestUrl.green}`)

  res.setHeader('Access-Control-Allow-Origin', '*')

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

    req.pipe(request(requestUrl)).pipe(res)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}
