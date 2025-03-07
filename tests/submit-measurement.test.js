import { test } from 'zinnia:test'
import { assertEquals, assertRejects } from 'zinnia:assert'
import { submit } from '../lib/submit-measurement.js'

test('submit measurement succeeds', async () => {
  const requests = []
  const fetch = async (url, allOpts) => {
    const { signal, ...opts } = allOpts
    requests.push({ url, opts })

    return {
      status: 200,
      ok: true

    }
  }

  const measurement = true
  await submit(measurement, fetch)
  assertEquals(requests.length, 1)
  assertEquals(requests, [
    {
      url: 'https://api.checker.network/arweave/measurement',
      opts: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retrievalSucceeded: measurement })
      }
    }
  ])
})

test('submit measurements fails', async () => {
  const requests = []
  const fetch = async (url, allOpts) => {
    const { signal, ...opts } = allOpts
    requests.push({ url, opts })

    return {
      status: 500,
      ok: false,
      text: async () => 'Internal Server Error'
    }
  }

  const measurement = true
  await assertRejects(async () => await submit(measurement, fetch), 'Failed to submit measurement (status=500)')
  assertEquals(requests.length, 1)
  assertEquals(requests, [
    {
      url: 'https://api.checker.network/arweave/measurement',
      opts: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retrievalSucceeded: measurement })
      }
    }
  ])
})
