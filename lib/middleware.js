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

    const requestOptions = {
      url: requestUrl,
      ...(
        typeof headers === 'object' && Object.keys(headers).length ?
          { headers } :
          {}
      ),
    }

    req.pipe(request(requestOptions)).pipe(res)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}
