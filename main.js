/* global Arweave */

import './vendor/arweave.js'
import pTimeout from './vendor/p-timeout.js'
import { getNodes } from './lib/nodes.js'

const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/
const ONE_MINUTE = 60_000
const MEASUREMENT_DELAY = ONE_MINUTE
const UPDATE_NODES_DELAY = 10 * ONE_MINUTE
const RANDOM_TRANSACTION_IDS = [
  'sHqUBKFeS42-CMCvNqPR31yEP63qSJG3ImshfwzJJF8',
  'vexijI_Ij0GfvWW1wvewlz255_v1Ni7dk9LuQdbi6yw',
  '797MuCtgdgiDrglJWczz2lMZkFkXInC88Htqv-JuOUQ',
  'XO6w3W8dYZnioq-phAbq8SG1Px5kci_j3RmcChS05VY',
  's2aJ5tzVEcSxITsq2G5cZnAhBDplCSkARJEOuNMZ31o'
]
const RETRIEVE_TIMEOUT = 10_000

const measure = async node => {
  const arweave = Arweave.init(node)
  const txId = RANDOM_TRANSACTION_IDS[Math.floor(Math.random() * RANDOM_TRANSACTION_IDS.length)]
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

const submit = async measurement => {
  const res = await fetch('https://api.checker.network/arweave/measurement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(measurement)
  })
  if (!res.ok) {
    throw new Error(`Failed to submit measurement (status=${res.status})`, {
      cause: new Error(await res.text().catch(() => null))
    })
  }
}

let nodes = await getNodes()

;(async () => {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, UPDATE_NODES_DELAY))
    try {
      nodes = await getNodes()
    } catch (err) {
      console.error('Error updating nodes')
      console.error(err)
    }
  }
})()

while (true) {
  const measurement = await measure(
    nodes[Math.floor(Math.random() * nodes.length)]
  )
  console.log('measurement:', measurement)
  try {
    await submit(measurement)
  } catch (err) {
    console.error('Error submitting measurement')
    console.error(err)
  }
  console.log(`Waiting ${MEASUREMENT_DELAY / 1_000} seconds...`)
  await new Promise(resolve => setTimeout(resolve, MEASUREMENT_DELAY))
}
