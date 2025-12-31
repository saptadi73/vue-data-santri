import { API_BASE_URL } from '../utils/apiConfig.js'

/**
 * Calculate poverty score for a specific pesantren
 * POST /api/pesantren-scoring/{pesantren_id}/calculate
 */
export async function calculatePesantrenScore(pesantrenId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pesantren-scoring/${pesantrenId}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Pesantren scoring data not found (404)')
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('calculatePesantrenScore success:', data)
    return data.data || data
  } catch (error) {
    console.error('calculatePesantrenScore error:', error)
    throw error
  }
}

/**
 * Get saved score for a pesantren from database
 * GET /api/pesantren-scoring/pesantren/{pesantren_id}
 */
export async function getPesantrenScore(pesantrenId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pesantren-scoring/pesantren/${pesantrenId}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Pesantren score not found (404)')
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('getPesantrenScore success:', data)
    return data.data || data
  } catch (error) {
    console.error('getPesantrenScore error:', error)
    throw error
  }
}

/**
 * Check if pesantren score exists
 * Returns true if score exists, false otherwise
 */
export async function checkPesantrenScoreExists(pesantrenId) {
  try {
    const score = await getPesantrenScore(pesantrenId)
    return score !== null && score !== undefined
  } catch (error) {
    console.error('checkPesantrenScoreExists error:', error)
    return false
  }
}

/**
 * Calculate scores for all pesantren in batch
 * POST /api/pesantren-scoring/batch/calculate-all
 */
export async function calculateAllPesantrenScores() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pesantren-scoring/batch/calculate-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('calculateAllPesantrenScores success:', data)
    return data.data || data
  } catch (error) {
    console.error('calculateAllPesantrenScores error:', error)
    throw error
  }
}
