import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/pesantren-fasilitas`

// Get fasilitas by pesantren ID
export const getFasilitasByPesantren = async (pesantrenId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/pesantren/${pesantrenId}`)

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // If 404, it means no fasilitas data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      const data = await response.json()
      throw new Error(data.message || 'Gagal mengambil data fasilitas')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // If it's a fetch error (network error), endpoint doesn't exist, return null
    if (error instanceof TypeError) {
      console.warn('⚠️ Fasilitas endpoint not available, returning null:', error.message)
      return { success: true, data: null }
    }
    console.error('Error fetching fasilitas by pesantren:', error)
    throw error
  }
}

// Get fasilitas detail by ID
export const getFasilitasDetail = async (fasilitasId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${fasilitasId}`)

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Gagal mengambil detail fasilitas')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching fasilitas detail:', error)
    throw error
  }
}

// Create new fasilitas
export const createFasilitas = async (payload) => {
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
      console.error('❌ Create Fasilitas Failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      })
      throw new Error(data.message || data.detail || 'Gagal membuat data fasilitas')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating fasilitas:', error)
    throw error
  }
}

// Update existing fasilitas
export const updateFasilitas = async (fasilitasId, payload) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${fasilitasId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Update Fasilitas Failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      })
      throw new Error(data.message || data.detail || 'Gagal memperbarui fasilitas')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating fasilitas:', error)
    throw error
  }
}

// Delete fasilitas
export const deleteFasilitas = async (fasilitasId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${fasilitasId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Gagal menghapus data fasilitas')
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting fasilitas:', error)
    throw error
  }
}
