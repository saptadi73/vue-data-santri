import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api/santri-pembiayaan`

// Get pembiayaan by santri ID
export const getPembiayaanBySantri = async (santriId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/santri/${santriId}`)
    const data = await response.json()

    if (!response.ok) {
      // If 404, it means no pembiayaan data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      throw new Error(data.message || 'Gagal mengambil data pembiayaan')
    }

    return data
  } catch (error) {
    console.error('Error fetching pembiayaan by santri:', error)
    throw error
  }
}

// Get pembiayaan detail by ID
export const getPembiayaanDetail = async (pembiayaanId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${pembiayaanId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail pembiayaan')
    }

    return data
  } catch (error) {
    console.error('Error fetching pembiayaan detail:', error)
    throw error
  }
}

// Create new pembiayaan
export const createPembiayaan = async (payload) => {
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
      throw new Error(data.message || 'Gagal membuat data pembiayaan')
    }

    return data
  } catch (error) {
    console.error('Error creating pembiayaan:', error)
    throw error
  }
}

// Update existing pembiayaan
export const updatePembiayaan = async (pembiayaanId, payload) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${pembiayaanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data pembiayaan')
    }

    return data
  } catch (error) {
    console.error('Error updating pembiayaan:', error)
    throw error
  }
}

// Delete pembiayaan
export const deletePembiayaan = async (pembiayaanId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${pembiayaanId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data pembiayaan')
    }

    return data
  } catch (error) {
    console.error('Error deleting pembiayaan:', error)
    throw error
  }
}
