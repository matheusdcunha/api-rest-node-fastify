import fastify from 'fastify'
import { env } from './env'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()
const port = env.PORT

app.addHook('preHandler', async () => {
  console.log('oi')
})
app.register(cookie)

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
