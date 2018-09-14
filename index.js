'use strict'

const fp = require('fastify-plugin')
const RedisMock = require('ioredis-mock')

function fastifyRedisMock (fastify, options, next) {
  var client = options.client || null

  if (!client) {
    try {
      client = new RedisMock(options)
    } catch (err) {
      return next(err)
    }
  }

  fastify
    .decorate('redis', client)
    .addHook('onClose', close)

  next()
}

function close (fastify, done) {
  fastify.redis.quit(done)
}

module.exports = fp(fastifyRedisMock, {
  fastify: '>=1.x',
  name: 'fastify-redis-mock'
})
