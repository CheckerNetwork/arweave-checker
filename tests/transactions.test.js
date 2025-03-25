import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { getTransactions } from '../lib/transactions.js'

test('should return list of confirmed transactions', async () => {
  const mockFetch = (url, opts) => {
    if (url === 'https://arweave.net/info') {
      return Promise.resolve({
        ok: true,
        json: async () => ({ height: 2 })
      })
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({ txs: ['1', '2', '3'] })
    })
  }

  const nodes = await getTransactions(mockFetch)
  assertEquals(nodes, ['1', '2', '3'])
})
