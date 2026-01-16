import { API_BASE_URL } from '@/utils/apiConfig'

const API_BASE = API_BASE_URL

/**
 * NL2SQL Service
 * Service untuk Natural Language to SQL API interactions
 */

/**
 * Detect intent from natural language query
 * @param {string} query - Natural language query
 * @returns {Promise<Object>} Intent detection result
 */
export const detectIntent = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/nl2sql/detect-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`Failed to detect intent: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error detecting intent:', error)
    throw error
  }
}

/**
 * Execute NL2SQL query
 * @param {string} query - Natural language query
 * @param {boolean} explain - Include explanation in response
 * @returns {Promise<Object>} Query execution result
 */
export const executeQuery = async (query, explain = false) => {
  try {
    const response = await fetch(`${API_BASE}/nl2sql/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, explain }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Query failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  }
}

/**
 * Get list of available intents
 * @returns {Promise<Object>} List of intents with examples
 */
export const getIntents = async () => {
  try {
    const response = await fetch(`${API_BASE}/nl2sql/intents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get intents: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting intents:', error)
    throw error
  }
}

/**
 * Run test queries
 * @returns {Promise<Object>} Test results
 */
export const runTests = async () => {
  try {
    const response = await fetch(`${API_BASE}/nl2sql/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to run tests: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error running tests:', error)
    throw error
  }
}

/**
 * Execute NL2SQL query and return GeoJSON for map visualization
 * @param {string} query - Natural language query
 * @returns {Promise<Object>} Query execution result with GeoJSON
 */
export const executeQueryMap = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/nl2sql/query-map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Map query failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error executing map query:', error)
    throw error
  }
}

export default {
  detectIntent,
  executeQuery,
  getIntents,
  runTests,
  executeQueryMap,
}
