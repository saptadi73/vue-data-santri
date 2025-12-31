import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/pesantren-fisik`

// Get fisik by pesantren ID
export const getFisikByPesantren = async (pesantrenId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/pesantren/${pesantrenId}`)
    const data = await response.json()

    if (!response.ok) {
      // If 404, it means no fisik data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      throw new Error(data.message || 'Gagal mengambil data fisik')
    }

    return data
  } catch (error) {
    console.error('Error fetching fisik by pesantren:', error)
    throw error
  }
}

// Get fisik detail by ID
export const getFisikDetail = async (fisikId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${fisikId}`)

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Gagal mengambil detail fisik')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching fisik detail:', error)
    throw error
  }
}

// Create new fisik
export const createFisik = async (payload) => {
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
      console.error('❌ Create Fisik Failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      })
      throw new Error(data.message || data.detail || 'Gagal membuat data fisik')
    }

    return data
  } catch (error) {
    console.error('Error creating fisik:', error)
    throw error
  }
}

// Update existing fisik
export const updateFisik = async (fisikId, payload) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${fisikId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data fisik')
    }

    return data
  } catch (error) {
    console.error('Error updating fisik:', error)
    throw error
  }
}

// Delete fisik
export const deleteFisik = async (fisikId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${fisikId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data fisik')
    }

    return data
  } catch (error) {
    console.error('Error deleting fisik:', error)
    throw error
  }
}
