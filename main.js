/* global Zinnia */

import { getNodes } from './lib/nodes.js'
import { getTransactions } from './lib/transactions.js'
import { measure } from './lib/measure.js'
import { submit } from './lib/submit-measurement.js'
import { pickRandomItem } from './lib/random.js'
import { MEASUREMENT_DELAY, UPDATE_NODES_DELAY } from './lib/constants.js'

let nodes = await getNodes()

  ; (async () => {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, UPDATE_NODES_DELAY))
    try {
      console.log('Updating nodes...')
      nodes = await getNodes()
    } catch (err) {
      console.error('Error updating nodes')
      console.error(err)
    }
  }
})()

while (true) {
  try {
    const txs = await getTransactions()
    if (txs.length > 0) {
      console.log(`Found ${txs.length} transactions`)
      const measurement = await measure(
        pickRandomItem(nodes),
        pickRandomItem(txs)
      )
      console.log('measurement:', measurement)
      await submit(measurement)
    } else {
      console.log('No transactions found')
    }
  } catch (err) {
    console.error(`Error: ${err}`)
  }

  Zinnia.jobCompleted()
  console.log(`Waiting ${MEASUREMENT_DELAY / 1_000} seconds...`)
  await new Promise(resolve => setTimeout(resolve, MEASUREMENT_DELAY))
}
