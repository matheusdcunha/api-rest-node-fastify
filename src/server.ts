import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()
const port = env.PORT

app.get('/hello', async () => {
  const teste = await knex('sqlite_schema').select('*')
  console.log(teste)
  return teste
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log('HTTP Server Running on port: ' + port)
  })
