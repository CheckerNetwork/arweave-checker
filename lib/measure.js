/* global Arweave */

import '../vendor/arweave.js'
import pTimeout from '../vendor/p-timeout.js'
import { RETRIEVE_TIMEOUT } from './constants.js'

export const measure = async (node, txId) => {
  const arweave = Arweave.init(node)
  try {
    await pTimeout(
      arweave.chunks.downloadChunkedData(txId),
      { milliseconds: RETRIEVE_TIMEOUT }
    )
  } catch (err) {
    console.error(err)
    return false
  }
  return true
}
