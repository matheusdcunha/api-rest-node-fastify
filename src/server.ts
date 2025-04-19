import fastify from 'fastify'
import { knex } from './database'

const app = fastify()
const port = 3333

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
