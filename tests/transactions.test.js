import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { getTransactions } from '../lib/transactions.js'

test('should return list of confirmed transactions', async () => {
  const mockFetch = (pages) => {
    return Promise.resolve({
      json: () => ({
        pages: 1,
        docs: [
          { status: 'confirmed', id: '1' },
          { status: 'pending', id: '2' },
          { status: 'confirmed', id: '3' }
        ]
      })
    })
  }

  const nodes = await getTransactions(mockFetch)
  assertEquals(nodes, ['1', '3'])
})
