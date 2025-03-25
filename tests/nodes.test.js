import { test } from 'zinnia:test'
import { assertEquals, assertRejects } from 'zinnia:assert'
import { getNodes } from '../lib/nodes.js'

test('should return arweave.net node by default', async () => {
  const mockFetch = (url) => {
    assertEquals(url, 'https://arweave.net/peers')
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => ([])
    })
  }

  const nodes = await getNodes(mockFetch)
  assertEquals(nodes, [{
    host: 'arweave.net', port: 443, protocol: 'https'
  }])
})

test('should return nodes from all pages with a custom fetch function', async () => {
  const mockFetch = (url) => {
    assertEquals(url, 'https://arweave.net/peers')
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => ([
        '127.0.0.1:1984',
        '127.0.0.1:1986',
        '127.0.0.1',
        'test.arweave.net',
        ''
      ])
    })
  }

  const nodes = await getNodes(mockFetch)
  assertEquals(nodes.length, 5)
  assertEquals(nodes, [
    { host: 'arweave.net', port: 443, protocol: 'https' },
    { host: '127.0.0.1', port: 1984, protocol: 'http' },
    { host: '127.0.0.1', port: 1986, protocol: 'http' },
    { host: '127.0.0.1', port: 80, protocol: 'http' },
    { host: 'test.arweave.net', port: 443, protocol: 'https' }
  ])
})

test('should return nodes where response status is OK', async () => {
  const mockFetch = (url) => {
    assertEquals(url, 'https://arweave.net/peers')
    return Promise.resolve({
      ok: false,
      status: 500,
      text: async () => ('Internal Server Error'),
      json: () => ([])
    })
  }

  const err = await assertRejects(async () => await getNodes(mockFetch))
  assertEquals(err.message, 'Failed to fetch nodes (500): Internal Server Error')
})
