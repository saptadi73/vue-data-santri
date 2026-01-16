import { API_BASE_URL } from '../utils/apiConfig.js'

/**
 * Service untuk batch/bulk scoring
 * Menghitung skor untuk semua santri atau pesantren secara bersamaan
 */

/**
 * Calculate scores untuk semua santri secara batch
 * Operasi ini bisa memakan waktu 15-30 detik tergantung jumlah data
 * 
 * @returns {Promise<Object>} Result dengan format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     total_processed: number,
 *     total_errors: number,
 *     results: Array<{santri_id, nama, skor_total, kategori}>,
 *     errors: Array<{santri_id, error}> | null
 *   }
 * }
 */
export async function batchCalculateSantriScores() {
  try {
    console.log('🔵 [BATCH SCORING] Starting batch santri score calculation...')
    
    const response = await fetch(
      `${API_BASE_URL}/api/scoring/batch/calculate-all`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('🔴 [BATCH SCORING] Error response:', errorData)
      throw new Error(
        errorData.detail || 
        errorData.message || 
        `Server error: ${response.status}`
      )
    }

    const data = await response.json()
    console.log('🟢 [BATCH SCORING] Batch santri calculation success:', data)
    
    return {
      success: true,
      message: data.message || 'Batch scoring selesai',
      data: data.data || data
    }
  } catch (error) {
    console.error('🔴 [BATCH SCORING] Error:', error)
    throw error
  }
}

/**
 * Calculate scores untuk semua pesantren secara batch
 * Operasi ini bisa memakan waktu tergantung jumlah data
 * 
 * @returns {Promise<Object>} Result dengan format yang sama seperti santri
 */
export async function batchCalculatePesantrenScores() {
  try {
    console.log('🔵 [BATCH SCORING] Starting batch pesantren score calculation...')
    
    const response = await fetch(
      `${API_BASE_URL}/api/pesantren-scoring/batch/calculate-all`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('🔴 [BATCH SCORING] Error response:', errorData)
      throw new Error(
        errorData.detail || 
        errorData.message || 
        `Server error: ${response.status}`
      )
    }

    const data = await response.json()
    console.log('🟢 [BATCH SCORING] Batch pesantren calculation success:', data)
    
    return {
      success: true,
      message: data.message || 'Batch scoring selesai',
      data: data.data || data
    }
  } catch (error) {
    console.error('🔴 [BATCH SCORING] Error:', error)
    throw error
  }
}

/**
 * Hitung kategori kemiskinan berdasarkan skor
 * @param {number} skor - Total skor (0-100)
 * @returns {string} Kategori (Sangat Miskin, Miskin, Rentan, Mampu)
 */
export function getKategoriFromScore(skor) {
  if (skor >= 80) return 'Sangat Miskin'
  if (skor >= 60) return 'Miskin'
  if (skor >= 40) return 'Rentan'
  return 'Mampu'
}

/**
 * Format hasil batch scoring untuk ditampilkan
 * @param {Object} result - Hasil dari API
 * @returns {Object} Formatted result dengan statistik tambahan
 */
export function formatBatchResult(result) {
  if (!result || !result.data) {
    return null
  }

  const data = result.data
  const results = data.results || []
  const errors = data.errors || []

  // Hitung statistik per kategori
  const categoryStats = {
    'Sangat Miskin': 0,
    'Miskin': 0,
    'Rentan': 0,
    'Mampu': 0,
  }

  results.forEach(item => {
    const kategori = item.kategori || getKategoriFromScore(item.skor_total)
    if (categoryStats.hasOwnProperty(kategori)) {
      categoryStats[kategori]++
    }
  })

  return {
    success: result.success !== false,
    message: result.message,
    totalProcessed: data.total_processed || results.length,
    totalSuccess: results.length,
    totalErrors: errors.length,
    categoryStats,
    results,
    errors,
  }
}
