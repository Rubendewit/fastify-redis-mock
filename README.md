# fastify-redis-mock

Fastify Redis mock connection plugin, with this you can share the same Redis mock connection in every part of your server.

This package is useful if you wish to unittest your Fastify project, without the need to run Redis itself.

Full credit goes to the [Fastify](https://github.com/fastify) team for building [fastify-redis](https://github.com/fastify/fastify-redis), and [stripsan](https://github.com/stipsan) for building [ioredis-mock](https://github.com/stipsan/ioredis-mock).

For documentation, please refer to either the [Fastify-redis docs](https://github.com/fastify/fastify-redis#readme), or [ioredis-mock docs](https://github.com/stipsan/ioredis-mock#readme).

## Install
```
npm i fastify-redis-mock --save
```
## Usage
Add it to your project with `register` and you are done!
You can access the *Redis* mock client via `fastify.redis`.

```js
const fastify = require('fastify')
const redis = require('fastify-redis')
const redisMock = require('fastify-redis-mock')

// Register the mock for e.g. unit tests
const redisInstance = process.env.ENVIRONMENT === 'unittest' ? redisMock : redis;

fastify.register(redisInstance, [options])

fastify.get('/foo', (req, reply) => {
  const { redis } = fastify
  redis.get(req.query.key, (err, val) => {
    reply.send(err || val)
  })
})

fastify.post('/foo', (req, reply) => {
  const { redis } = fastify
  redis.set(req.body.key, req.body.value, (err) => {
    reply.send(err || { status: 'ok' })
  })
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

## Acknowledgements

This project is copied from:
- [fastify-redis](https://github.com/fastify/fastify-redis)

## License

Licensed under [MIT](./LICENSE).
