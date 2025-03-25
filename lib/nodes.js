import { assertOkResponse } from './http-assertions.js'

const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/

export const getNodes = async (fetch = globalThis.fetch) => {
  const response = await fetch('https://arweave.net/peers')
  await assertOkResponse(response, 'Failed to fetch nodes')
  const peers = await response.json()
  const nodes = [
    {
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    },
    ...peers
      .filter(Boolean)
      .map(addr => {
        const [host, port] = addr.split(':')
        const protocol = IP_ADDRESS_REGEX.test(host) ? 'http' : 'https'
        return {
          host,
          port: port
            ? Number(port)
            : protocol === 'http' ? 80 : 443,
          protocol
        }
      })
  ]
  console.log(`Found ${nodes.length} nodes`)
  return nodes
}
