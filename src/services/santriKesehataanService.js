import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api/santri-kesehatan`

// Get kesehatan by santri ID
export const getKesehataanBySantri = async (santriId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/santri/${santriId}`)
    const data = await response.json()

    if (!response.ok) {
      // If 404, it means no kesehatan data exists yet
      if (response.status === 404) {
        return { success: true, data: null }
      }
      throw new Error(data.message || 'Gagal mengambil data kesehatan')
    }

    return data
  } catch (error) {
    console.error('Error fetching kesehatan by santri:', error)
    throw error
  }
}

// Get kesehatan detail by ID
export const getKesehataanDetail = async (kesehataanId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${kesehataanId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail kesehatan')
    }

    return data
  } catch (error) {
    console.error('Error fetching kesehatan detail:', error)
    throw error
  }
}

// Create new kesehatan
export const createKesehatan = async (payload) => {
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
      throw new Error(data.message || 'Gagal menyimpan data kesehatan')
    }

    return data
  } catch (error) {
    console.error('Error creating kesehatan:', error)
    throw error
  }
}

// Update kesehatan
export const updateKesehatan = async (kesehataanId, payload) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${kesehataanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data kesehatan')
    }

    return data
  } catch (error) {
    console.error('Error updating kesehatan:', error)
    throw error
  }
}

// Delete kesehatan
export const deleteKesehatan = async (kesehataanId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${kesehataanId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data kesehatan')
    }

    return data
  } catch (error) {
    console.error('Error deleting kesehatan:', error)
    throw error
  }
}
