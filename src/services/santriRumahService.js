import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api/santri-rumah`

// Get rumah by santri ID
export const getRumahBySantri = async (santriId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/santri/${santriId}`)
    const data = await response.json()

    if (!response.ok) {
      // If 404, it means no rumah data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      throw new Error(data.message || 'Gagal mengambil data rumah')
    }

    return data
  } catch (error) {
    console.error('Error fetching rumah by santri:', error)
    throw error
  }
}

// Get rumah detail by ID
export const getRumahDetail = async (rumahId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${rumahId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail rumah')
    }

    return data
  } catch (error) {
    console.error('Error fetching rumah detail:', error)
    throw error
  }
}

// Create new rumah
export const createRumah = async (payload) => {
  try {
    // Check if payload contains photos (FormData) or regular JSON
    const isFormData = payload instanceof FormData

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }),
      body: isFormData ? payload : JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan data rumah')
    }

    return data
  } catch (error) {
    console.error('Error creating rumah:', error)
    throw error
  }
}

// Update rumah
export const updateRumah = async (rumahId, payload) => {
  try {
    // Check if payload contains photos (FormData) or regular JSON
    const isFormData = payload instanceof FormData

    const response = await fetch(`${API_ENDPOINT}/${rumahId}`, {
      method: 'PUT',
      ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }),
      body: isFormData ? payload : JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data rumah')
    }

    return data
  } catch (error) {
    console.error('Error updating rumah:', error)
    throw error
  }
}

// Delete rumah
export const deleteRumah = async (rumahId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${rumahId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data rumah')
    }

    return data
  } catch (error) {
    console.error('Error deleting rumah:', error)
    throw error
  }
}
