import { getNodes } from './lib/nodes.js'
import { getTransactions } from './lib/transactions.js'
import { measure } from './lib/measure.js'
import { pickRandomItem } from './lib/random.js'
import { MEASUREMENT_DELAY, UPDATE_NODES_DELAY } from './lib/constants.js'

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
      console.log('Updating nodes...')
      nodes = await getNodes()
    } catch (err) {
      console.error('Error updating nodes')
      console.error(err)
    }
  }
})()

while (true) {
  const txs = await getTransactions()
  console.log(`Found ${txs.length} transactions`)
  const measurement = await measure(
    pickRandomItem(nodes),
    pickRandomItem(txs)
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
