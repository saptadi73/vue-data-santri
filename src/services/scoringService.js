import { API_BASE_URL } from '../utils/apiConfig'

/**
 * Service untuk scoring santri
 * Menghitung skor kemiskinan berdasarkan data ekonomi, rumah, aset, dll.
 */

/**
 * Calculate score untuk santri tertentu
 * @param {string} santriId - UUID santri
 * @returns {Promise<Object>} Score data
 */
export const calculateSantriScore = async (santriId) => {
  const url = `${API_BASE_URL}/api/scoring/${santriId}/calculate`
  console.log('🔵 [DEBUG] Calculating score for santri:', santriId)
  console.log('🔵 [DEBUG] URL:', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('🔵 [DEBUG] Response status:', response.status)
    console.log('🔵 [DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

    // Always try to parse the response first for debugging
    let errorData = null
    try {
      errorData = await response.json()
      console.log('🔵 [DEBUG] Response body:', errorData)
    } catch (parseError) {
      console.warn('🟡 [DEBUG] Could not parse response as JSON:', parseError)
    }

    if (!response.ok) {
      console.error('🔴 [DEBUG] Error response received:')
      console.error('🔴 [DEBUG] Status:', response.status)
      console.error('🔴 [DEBUG] Data:', errorData)

      // Use helper to print detailed debug info
      debugPrintError(errorData, response.status)

      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        `Server error: ${response.status} ${response.statusText}`

      throw new Error(errorMessage)
    }

    console.log('🟢 [DEBUG] Score calculation successful')
    return errorData?.data || errorData
  } catch (error) {
    console.error('🔴 [ERROR] Calculate score failed:')
    console.error('🔴 [ERROR] Message:', error.message)
    console.error('🔴 [ERROR] Stack:', error.stack)
    throw error
  }
}

/**
 * Get score untuk santri tertentu
 * @param {string} santriId - UUID santri
 * @returns {Promise<Object|null>} Score data atau null jika belum ada
 */
export const getSantriScore = async (santriId) => {
  const url = `${API_BASE_URL}/api/scoring/santri/${santriId}`
  console.log('🔵 [DEBUG] Getting score for santri:', santriId)
  console.log('🔵 [DEBUG] URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('🔵 [DEBUG] Response status:', response.status)

    if (!response.ok) {
      // Jika 404, berarti belum ada score
      if (response.status === 404) {
        console.log('🟡 [DEBUG] Score not found (404)')
        return null
      }

      let errorData = null
      try {
        errorData = await response.json()
        console.log('🔴 [DEBUG] Error response:', errorData)
      } catch (parseError) {
        console.warn('🟡 [DEBUG] Could not parse error response')
      }

      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        `Server error: ${response.status}`

      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('🟢 [DEBUG] Score retrieved successfully')
    return data.data
  } catch (error) {
    console.error('🔴 [ERROR] Get score failed:')
    console.error('🔴 [ERROR] Message:', error.message)
    throw error
  }
}

/**
 * Check apakah santri sudah punya score
 * @param {string} santriId - UUID santri
 * @returns {Promise<boolean>} true jika sudah ada score
 */
export const checkSantriScoreExists = async (santriId) => {
  try {
    const score = await getSantriScore(santriId)
    return score !== null
  } catch (error) {
    return false
  }
}

/**
 * Calculate scores untuk semua santri
 * @returns {Promise<Object>} Batch calculation result
 */
export const calculateAllScores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scoring/batch/calculate-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Gagal menghitung skor batch')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error calculating all scores:', error)
    throw error
  }
}
/**
 * Debug helper - print full error info to console
 * @param {*} errorData - Error data from server
 * @param {number} status - HTTP status code
 */
export const debugPrintError = (errorData, status) => {
  console.group('🔴 BACKEND ERROR DEBUG INFO')
  console.log('Status Code:', status)
  console.log('Full Response Object:', errorData)

  if (errorData) {
    console.log('--- Response Fields ---')
    Object.entries(errorData).forEach(([key, value]) => {
      console.log(`${key}:`, value)
    })
  }

  console.log('--- Possible Issues ---')
  if (status === 400) {
    console.log('❌ 400 Bad Request - Check:')
    console.log('  • Invalid field values')
    console.log('  • Missing required data')
    console.log('  • Data type mismatch')
  } else if (status === 404) {
    console.log('❌ 404 Not Found - Resource not found')
  } else if (status === 500) {
    console.log('❌ 500 Server Error - Backend processing error')
  }

  console.groupEnd()
}
