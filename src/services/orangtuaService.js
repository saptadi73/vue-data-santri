import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api/santri-orangtua`

/**
 * Get all orangtua for a specific santri
 */
export const getOrangtuaList = async (santriId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      santri_id: santriId,
      page: filters.page || 1,
      per_page: filters.per_page || 20,
    })

    if (filters.search) queryParams.append('search', filters.search)
    if (filters.hubungan) queryParams.append('hubungan', filters.hubungan)

    const response = await fetch(`${API_ENDPOINT}?${queryParams.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data orangtua')
    }

    return data
  } catch (error) {
    console.error('Error fetching orangtua list:', error)
    throw error
  }
}

/**
 * Get orangtua detail by ID
 */
export const getOrangtuaDetail = async (orangtuaId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${orangtuaId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail orangtua')
    }

    return data
  } catch (error) {
    console.error('Error fetching orangtua detail:', error)
    throw error
  }
}

/**
 * Create new orangtua with optional photos
 */
export const createOrangtua = async (orangtuaData) => {
  try {
    // Always use FormData when files are present
    const hasFiles =
      orangtuaData.fotos && Array.isArray(orangtuaData.fotos) && orangtuaData.fotos.length > 0

    if (hasFiles) {
      const formData = new FormData()

      // Add all form fields
      Object.keys(orangtuaData).forEach((key) => {
        if (key === 'fotos') {
          // Handle multiple photos
          orangtuaData.fotos.forEach((file) => {
            formData.append('fotos', file)
          })
        } else if (orangtuaData[key] !== null && orangtuaData[key] !== undefined) {
          formData.append(key, orangtuaData[key])
        }
      })

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat data orangtua')
      }

      return data
    } else {
      // Use JSON when no files
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orangtuaData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat data orangtua')
      }

      return data
    }
  } catch (error) {
    console.error('Error creating orangtua:', error)
    throw error
  }
}

/**
 * Update orangtua data
 */
export const updateOrangtua = async (orangtuaId, orangtuaData) => {
  try {
    // Check if has files to upload
    const hasFiles =
      orangtuaData.fotos && Array.isArray(orangtuaData.fotos) && orangtuaData.fotos.length > 0

    console.group('📝 Update Orangtua')
    console.log('orangtuaId:', orangtuaId)
    console.log('Has files:', hasFiles)
    console.log('Fotos:', orangtuaData.fotos)
    if (hasFiles) {
      console.log('File details:')
      orangtuaData.fotos.forEach((f, i) => {
        console.log(`  [${i}]:`, f instanceof File ? `File: ${f.name} (${f.size} bytes)` : f)
      })
    }
    console.groupEnd()

    if (hasFiles) {
      const formData = new FormData()

      // Add all form fields
      Object.keys(orangtuaData).forEach((key) => {
        if (key === 'fotos') {
          // Handle multiple photos
          orangtuaData.fotos.forEach((file) => {
            console.log('Appending file:', file.name)
            formData.append('fotos', file)
          })
        } else if (orangtuaData[key] !== null && orangtuaData[key] !== undefined) {
          formData.append(key, orangtuaData[key])
        }
      })

      const response = await fetch(`${API_ENDPOINT}/${orangtuaId}`, {
        method: 'PUT',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupdate data orangtua')
      }

      return data
    } else {
      // Use JSON when no files
      const response = await fetch(`${API_ENDPOINT}/${orangtuaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orangtuaData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupdate data orangtua')
      }

      return data
    }
  } catch (error) {
    console.error('Error updating orangtua:', error)
    throw error
  }
}

/**
 * Delete orangtua
 */
export const deleteOrangtua = async (orangtuaId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${orangtuaId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data orangtua')
    }

    return data
  } catch (error) {
    console.error('Error deleting orangtua:', error)
    throw error
  }
}

/**
 * Add photos to existing orangtua
 */
export const addOrangtuaPhotos = async (orangtuaId, photos) => {
  try {
    const formData = new FormData()

    Array.from(photos).forEach((file) => {
      formData.append('fotos', file)
    })

    const response = await fetch(`${API_ENDPOINT}/${orangtuaId}/photos`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menambahkan foto')
    }

    return data
  } catch (error) {
    console.error('Error adding orangtua photos:', error)
    throw error
  }
}

/**
 * Update a single photo
 */
export const updateOrangtuaPhoto = async (fotoId, photo) => {
  try {
    const formData = new FormData()
    formData.append('foto', photo)

    const response = await fetch(`${API_ENDPOINT}/photos/${fotoId}`, {
      method: 'PUT',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengupdate foto')
    }

    return data
  } catch (error) {
    console.error('Error updating orangtua photo:', error)
    throw error
  }
}

/**
 * Delete a single photo
 */
export const deleteOrangtuaPhoto = async (fotoId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/photos/${fotoId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus foto')
    }

    return data
  } catch (error) {
    console.error('Error deleting orangtua photo:', error)
    throw error
  }
}
