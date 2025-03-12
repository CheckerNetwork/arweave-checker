/* global Arweave */

import '../vendor/arweave.js'
import pTimeout from '../vendor/p-timeout.js'
import { RETRIEVE_TIMEOUT } from './constants.js'


/**
 * Performs a retrieval for given node and transaction and returns measurement results.
 *
 * @param {{ host: string; port: number; protocol: string; }} node
 * @param {string} txId
 * @returns { Promise<{ retrievalSucceeded: boolean }> }
 */
export const measure = async (node, txId) => {
  let retrievalSucceeded = true
  const arweave = Arweave.init(node)
  try {
    await pTimeout(
      arweave.chunks.downloadChunkedData(txId),
      { milliseconds: RETRIEVE_TIMEOUT }
    )
  } catch (err) {
    console.error(err)
    retrievalSucceeded = false
  }

  return { retrievalSucceeded }
}
