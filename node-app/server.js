const fastify = require('fastify')({
  logger: true
})

const fastifyPort = process.env.PORT
const upstreamPort = process.env.UPSTREAM_PORT
const maxIdleTime = 1000 * (process.env.EXIT_WHEN_IDLE ?? 0)

// Exit the process gracefully upon signals or uncaught errors.
const {close} = require('close-with-grace')({ delay: 100 }, async function () {
  await fastify.close()
})

// Exit the process if no requests have come in for a while.
if (maxIdleTime > 0) {
  fastify.register(require('fastify-close-idle-server'), {
    delay: maxIdleTime,
    closeFunction: close,
  })
}

// Proxy to the upstream server.
fastify.register(require('@fastify/http-proxy'), {
  upstream: `http://localhost:${ upstreamPort }`,
  replyOptions: {
    rewriteRequestHeaders (originalReq, headers) {
      return {
        ...headers,
        host: originalReq.headers.host,
        'x-forwarded-for': [originalReq.headers['x-forwarded-for'], originalReq.socket.remoteAddress].filter(Boolean).join(', '),
      }
    },
  },
})

// Start handling requests.
fastify.listen({ port: fastifyPort, host: '0.0.0.0' })
