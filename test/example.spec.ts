import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transactions',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')

    if (cookies) {
      const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

      expect(listTransactionsResponse.body.transactions).toEqual([
        expect.objectContaining({
          title: 'New Transactions',
          amount: 5000,
        }),
      ])
    }
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')

    if (cookies) {
      const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

      const id = listTransactionsResponse.body.transactions[0].id

      const getTransactionResponse = await request(app.server)
        .get('/transactions/' + id)
        .set('Cookie', cookies)
        .expect(200)

      expect(getTransactionResponse.body.transaction).toEqual(
        expect.objectContaining({
          title: 'New Transactions',
          amount: 5000,
        }),
      )
    }
  })

  it('should be able to get the summary', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')

    if (cookies) {
      await request(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
          title: 'Debit',
          amount: 2000,
          type: 'debit',
        })

      const summaryResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
        .expect(200)

      expect(summaryResponse.body.summary).toEqual({
        amount: 3000,
      })
    }
  })
})
