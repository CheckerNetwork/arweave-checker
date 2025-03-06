import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { getNodes } from '../lib/nodes.js'

test('should arweave node by default', async () => {
  const mockFetch = (pages) => {
    return Promise.resolve({
      json: () => ({
        pages: 1,
        docs: []
      })
    })
  }

  const nodes = await getNodes(mockFetch);
  console.log(nodes)
  assertEquals(nodes, [{
    host: "arweave.net", port: 443, protocol: "https"
  }])
})

test('should return nodes with a custom fetch function', async () => {
  const mockFetch = (pages) => {
    return Promise.resolve({
      json: () => ({
        pages: 1,
        docs: [
          { id: '127.0.0.1:1984' },
          { id: '127.0.0.1:1986' },
          { id: '127.0.0.1' },
          { id: 'test.arweave.net' },
          { id: '' },
          {}
        ]
      })
    })
  }

  const nodes = await getNodes(mockFetch);
  assertEquals(nodes.length, 5)
  assertEquals(nodes, [
    { host: 'arweave.net', port: 443, protocol: 'https' },
    { host: '127.0.0.1', port: 1984, protocol: 'http' },
    { host: '127.0.0.1', port: 1986, protocol: 'http' },
    { host: '127.0.0.1', port: 80, protocol: 'http' },
    { host: 'test.arweave.net', port: 443, protocol: 'https' },
  ])
})


test('should return nodes from all pages with a custom fetch function', async () => {
  const mockFetch = (page) => {
    if (page === 0) {
      return Promise.resolve({
        json: () => ({
          pages: 2,
          docs: [
            { id: '127.0.0.1:1984' },
            { id: '127.0.0.1:1986' },
            {}
          ]
        })
      })
    }

    return Promise.resolve({
      json: () => ({
        pages: 2,
        docs: [
            { id: '127.0.0.1' },
            { id: 'test.arweave.net' },
            { id: '' },
        ]
      })
    })
  }

  const nodes = await getNodes(mockFetch);
  assertEquals(nodes.length, 5)
  assertEquals(nodes, [
    { host: 'arweave.net', port: 443, protocol: 'https' },
    { host: '127.0.0.1', port: 1984, protocol: 'http' },
    { host: '127.0.0.1', port: 1986, protocol: 'http' },
    { host: '127.0.0.1', port: 80, protocol: 'http' },
    { host: 'test.arweave.net', port: 443, protocol: 'https' },
  ])
})
