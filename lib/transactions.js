import { pickRandomNumber } from './random.js'

/**
 * Fetches a random list of confirmed transaction IDs from the Arweave network.
 *
 * @param {Function} fetchTransactions - A function to fetch transactions from a specific page.
 * @returns {Promise<string[]>} A promise that resolves to an array of confirmed transaction IDs.
 */
export const getTransactions = async (fetchTransactions = fetchTransactionsFromViewblock) => {
  // We hardcode the min and max page numbers for now to avoid hitting the API too much
  // Transactions before page 50 are less likely to be confirmed
  const minPage = 50
  // Max page set to 10,000 to fetch recent transactions. Adjust as needed (max is around 2.8M).
  const maxPage = 10_000

  // TODO: Find a publicly documented API
  const randomPageNumber = pickRandomNumber(minPage, maxPage)

  const res = await fetchTransactions(randomPageNumber)
  const transactions = await res.json()
  return transactions.docs.reduce((acc, tx) => {
    if (tx.status === 'confirmed') {
      acc.push(tx.id)
    }
    return acc
  }, [])
}

/**
 * Fetches transactions from the Viewblock API for the Arweave network.
 *
 * @param {number} [page=0] - The page number to fetch transactions from.
 * @returns {Promise<Response>} A promise that resolves to the fetch response.
 */
const fetchTransactionsFromViewblock = async (page = 0) => {
  return fetch(
    `https://api.viewblock.io/arweave/txs?page=${page}&network=mainnet`,
    {
      headers: {
        Origin: 'https://viewblock.io'
      }
    }
  )
}
