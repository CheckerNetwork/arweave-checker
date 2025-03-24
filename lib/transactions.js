import { assertOkResponse } from './http-assertions.js'
import { pickRandomNumber } from './random.js'

/**
 * Fetches a random block from the Arweave network and returns the IDs of its transactions.
 *
 * @param {typeof globalThis.fetch} fetch - The fetch function to use.
 * @returns {Promise<string[]>} A promise that resolves to an array of transaction IDs.
 */
export const getTransactions = async (fetch = globalThis.fetch) => {
  console.log('Fetching current network info')
  const infoResp = await fetch('https://arweave.net/info')
  await assertOkResponse(infoResp, 'Failed to fetch network info')
  const info = await infoResp.json()

  console.log(`Current network height: ${info.height}`)

  const minBlock = 2
  const randomBlockNumber = pickRandomNumber(minBlock, info.height)

  console.log(`Fetching block ${randomBlockNumber}`)

  const randomBlockResp = await fetch(`https://arweave.net/block/height/${randomBlockNumber}`, {
    headers: {
      accept: 'application/json',
      'X-Block-Format': '2'
    }
  })

  await assertOkResponse(randomBlockResp, 'Failed to fetch random block')
  const { txs } = await randomBlockResp.json()

  console.log(`Fetched block ${randomBlockNumber} with ${txs.length} transactions`)
  return txs
}
