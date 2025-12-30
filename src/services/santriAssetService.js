import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api/santri-asset`

// Get assets for a santri (minimal list for existence check)
export const getSantriAssets = async (santriId, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      santri_id: santriId,
      page: params.page || 1,
      per_page: params.per_page || 10,
    })

    const response = await fetch(`${API_ENDPOINT}?${queryParams.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data aset santri')
    }

    return data
  } catch (error) {
    console.error('Error fetching santri assets:', error)
    throw error
  }
}

// Get asset detail by ID
export const getAssetDetail = async (assetId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${assetId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail aset')
    }

    return data
  } catch (error) {
    console.error('Error fetching asset detail:', error)
    throw error
  }
}

// Create asset (JSON payload)
export const createAsset = async (payload) => {
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
      throw new Error(data.message || 'Gagal menyimpan data aset')
    }

    return data
  } catch (error) {
    console.error('Error creating asset:', error)
    throw error
  }
}

// Create asset with optional photos (multipart/form-data)
export const createAssetWithPhotos = async ({
  santri_id,
  jenis_aset,
  jumlah,
  nilai_perkiraan,
  files,
}) => {
  try {
    const formData = new FormData()
    formData.append('santri_id', santri_id)
    formData.append('jenis_aset', jenis_aset)
    formData.append('jumlah', jumlah ?? 1)
    formData.append('nilai_perkiraan', nilai_perkiraan ?? 0)

    if (files && files.length) {
      files.forEach((file) => {
        formData.append('fotos', file)
        formData.append('foto_files', file)
        formData.append('files', file)
        formData.append('foto_asset', file)
      })
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      const message =
        typeof data === 'string' ? data : data?.message || data?.detail || JSON.stringify(data)
      throw new Error(message || 'Gagal menyimpan data aset')
    }

    return data
  } catch (error) {
    console.error('Error creating asset with photos:', error)
    throw error
  }
}

// Update asset (JSON payload)
export const updateAsset = async (assetId, payload) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${assetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data aset')
    }

    return data
  } catch (error) {
    console.error('Error updating asset:', error)
    throw error
  }
}

// Bulk create assets with photos (FormData)
export const bulkCreateAssets = async (formData) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/bulk`, {
      method: 'POST',
      body: formData, // FormData automatically sets correct Content-Type
    })

    const data = await response.json()

    if (!response.ok) {
      const message =
        typeof data === 'string' ? data : data?.message || data?.detail || JSON.stringify(data)
      throw new Error(message || 'Gagal menyimpan data aset secara bulk')
    }

    return data
  } catch (error) {
    console.error('Error bulk creating assets:', error)
    throw error
  }
}

// Delete asset
export const deleteAsset = async (assetId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${assetId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus data aset')
    }

    return data
  } catch (error) {
    console.error('Error deleting asset:', error)
    throw error
  }
}

// Add photos to an asset
export const addAssetPhotos = async (assetId, files) => {
  try {
    const formData = new FormData()
    // Backend expects field name 'fotos' (see 422: missing body.fotos)
    files.forEach((file) => formData.append('fotos', file))

    const response = await fetch(`${API_ENDPOINT}/${assetId}/photos`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      const details = data?.message || data?.detail || data
      const message =
        typeof details === 'string'
          ? details
          : details
            ? JSON.stringify(details)
            : 'Gagal menambahkan foto aset'
      throw new Error(message)
    }

    return data
  } catch (error) {
    console.error('Error adding asset photos:', error)
    throw error
  }
}

// Delete a photo from an asset
export const deleteAssetPhoto = async (fotoId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/photos/${fotoId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus foto aset')
    }

    return data
  } catch (error) {
    console.error('Error deleting asset photo:', error)
    throw error
  }
}
