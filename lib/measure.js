/* global Arweave */

import '../vendor/arweave.js'
import pTimeout from '../vendor/p-timeout.js'
import { RETRIEVE_TIMEOUT } from './constants.js'

/**
 * Performs a retrieval for given node and transaction Id and returns measurement results.
 *
 * @param {{ host: string; port: number; protocol: string; }} node
 * @param {string} txId
 * @returns { Promise<{ retrievalSucceeded: boolean }> }
 */
export const measure = async (node, txId) => {
  const nodeUrl = `${node.protocol}://${node.host}:${node.port}`
  const arweave = Arweave.init(node)
  try {
    console.log(`Retrieving transaction ${txId} from ${nodeUrl}`)
    const response = await pTimeout(
      arweave.chunks.downloadChunkedData(txId),
      { milliseconds: RETRIEVE_TIMEOUT }
    )

    console.log(`Finished retrieving transaction ${txId} from ${nodeUrl}. Success: ${response.ok}`)
    return { retrievalSucceeded: response.ok }
  } catch (err) {
    console.error(`Failed to retrieve transaction ${txId} from ${nodeUrl}: ${err}`)
    return { retrievalSucceeded: false }
  }
}
