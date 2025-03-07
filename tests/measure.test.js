import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { measure } from '../lib/measure.js'

const TX_ID = 'sHqUBKFeS42-CMCvNqPR31yEP63qSJG3ImshfwzJJF8'
const NODE = {
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
}

test('should return true for a successful measurement', async () => {
  const result = await measure(NODE, TX_ID)
  assertEquals(result, true)
})
