import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api/santri-bansos`

// Get bansos by santri ID
export const getBansosBySantri = async (santriId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/santri/${santriId}`)
    const data = await response.json()

    if (!response.ok) {
      // If 404, it means no bansos data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      throw new Error(data.message || 'Gagal mengambil data bansos')
    }

    return data
  } catch (error) {
    console.error('Error fetching bansos by santri:', error)
    throw error
  }
}

// Get bansos detail by ID
export const getBansosDetail = async (bansosId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${bansosId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail bansos')
    }

    return data
  } catch (error) {
    console.error('Error fetching bansos detail:', error)
    throw error
  }
}

// Create new bansos
export const createBansos = async (payload) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan data bansos')
    }

    return data
  } catch (error) {
    console.error('Error creating bansos:', error)
    throw error
  }
}

// Update bansos
export const updateBansos = async (bansosId, payload) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${bansosId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data bansos')
    }

    return data
  } catch (error) {
    console.error('Error updating bansos:', error)
    throw error
  }
}

// Delete bansos
export const deleteBansos = async (bansosId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${bansosId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data bansos')
    }

    return data
  } catch (error) {
    console.error('Error deleting bansos:', error)
    throw error
  }
}
