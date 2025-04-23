import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()
const port = env.PORT

app.register(transactionsRoutes, {
  prefix: '/transactions',
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log('HTTP Server Running on port: ' + port)
  })
