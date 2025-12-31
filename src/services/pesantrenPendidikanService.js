import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/pesantren-pendidikan`

// Get pendidikan by pesantren ID
export const getPendidikanByPesantren = async (pesantrenId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/pesantren/${pesantrenId}`)

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // If 404, it means no pendidikan data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      const data = await response.json()
      throw new Error(data.message || 'Gagal mengambil data pendidikan')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // If it's a fetch error (network error), endpoint doesn't exist, return null
    if (error instanceof TypeError) {
      console.warn('⚠️ Pendidikan endpoint not available, returning null:', error.message)
      return { success: true, data: null }
    }
    console.error('Error fetching pendidikan by pesantren:', error)
    throw error
  }
}

// Get pendidikan detail by ID
export const getPendidikanDetail = async (pendidikanId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${pendidikanId}`)

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Gagal mengambil detail pendidikan')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching pendidikan detail:', error)
    throw error
  }
}

// Create new pendidikan
export const createPendidikan = async (payload) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Create Pendidikan Failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      })
      throw new Error(data.message || data.detail || 'Gagal membuat data pendidikan')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating pendidikan:', error)
    throw error
  }
}

// Update existing pendidikan
export const updatePendidikan = async (pendidikanId, payload) => {
  try {
    // Remove pesantren_id from payload for update, as it's not needed
    const { pesantren_id, ...updatePayload } = payload

    console.log('📤 Updating pendidikan:', {
      url: `${API_ENDPOINT}/${pendidikanId}`,
      payload: updatePayload,
    })

    const response = await fetch(`${API_ENDPOINT}/${pendidikanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Update Pendidikan Failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      })
      throw new Error(data.message || data.detail || 'Gagal memperbarui data pendidikan')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating pendidikan:', error)
    throw error
  }
}

// Delete pendidikan
export const deletePendidikan = async (pendidikanId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${pendidikanId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Gagal menghapus data pendidikan')
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting pendidikan:', error)
    throw error
  }
}
