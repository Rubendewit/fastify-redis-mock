'use strict'

const fp = require('fastify-plugin')
const RedisMock = require('ioredis-mock')

function fastifyRedisMock (fastify, options, next) {
  const { namespace, url, ...redisOptions } = options
  let client = options.client || null

  if (namespace) {
    if (!fastify.redis) {
      fastify.decorate('redis', {})
    }

    if (fastify.redis[namespace]) {
      return next(new Error(`Redis '${namespace}' instance namespace has already been registered`))
    }

    const closeNamedInstance = (fastify, done) => {
      fastify.redis[namespace].quit(done)
    }

    if (!client) {
      try {
        client = new RedisMock(redisOptions)
      } catch (err) {
        return next(err)
      }

      fastify.addHook('onClose', closeNamedInstance)
    }

    fastify.redis[namespace] = client

    if (options.closeClient === true) {
      fastify.addHook('onClose', closeNamedInstance)
    }
  } else {
    if (fastify.redis) {
      return next(new Error('fastify-redis has already been registered'))
    } else {
      if (!client) {
        try {
          client = new RedisMock(redisOptions)
        } catch (err) {
          return next(err)
        }

        fastify.addHook('onClose', close)
      }

      fastify.decorate('redis', client)

      if (options.closeClient === true) {
        fastify.addHook('onClose', close)
      }
    }
  }

  next()
}

function close (fastify, done) {
  fastify.redis.quit(done)
}

module.exports = fp(fastifyRedisMock, {
  fastify: '>=1.x',
  name: 'fastify-redis-mock'
})
