const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/

export const getNodes = async (fetchNodes = fetchNodesFromViewblock) => {
  // TODO: Find a publicly documented API
  const docs = []
  let maxPage = Infinity
  for (let page = 0; page < maxPage; page++) {
    const res = await fetchNodes(page)
    if (!res.ok) {
      const reason = await res.text().catch(err => err)
      console.log('fetchNodes(%s) failed - %s: %s', page, res.statusCode, reason)
      continue
    }

    const body = await res.json()
    if (maxPage === Infinity) {
      maxPage = body.pages
    }
    docs.push(...body.docs)
  }
  const nodes = [
    {
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    },
    ...docs
      .map(doc => doc.id)
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

/**
 * Fetches arweave nodes from the ViewBlock API
 *
 * @param {number} page
 */
const fetchNodesFromViewblock = (page) => {
  return fetch(
    `https://api.viewblock.io/arweave/nodes?page=${page}&network=mainnet`,
    {
      headers: {
        Origin: 'https://viewblock.io'
      }
    }
  )
}
