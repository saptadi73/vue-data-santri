// API Service for Santri CRUD Operations
import { API_BASE_URL } from '@/utils/apiConfig'

const API_ENDPOINT = `${API_BASE_URL}/api`

/**
 * Get list of santri with pagination and filters
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getSantriList = async (params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page)
  if (params.per_page) queryParams.append('per_page', params.per_page)
  if (params.search) queryParams.append('search', params.search)
  if (params.provinsi) queryParams.append('provinsi', params.provinsi)
  if (params.kabupaten) queryParams.append('kabupaten', params.kabupaten)
  if (params.jenis_kelamin) queryParams.append('jenis_kelamin', params.jenis_kelamin)

  const url = `${API_ENDPOINT}/santri-pribadi?${queryParams}`

  console.group('🔍 API Call: Get Santri List')
  console.log('📤 Request URL:', url)
  console.log('📤 Query Params:', params)

  try {
    const response = await fetch(url)
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', errorData)
      console.groupEnd()
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Response Data:', data)
    console.groupEnd()
    return data
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    if (error.message.includes('fetch')) {
      throw new Error(
        'Tidak dapat terhubung ke server. Pastikan API berjalan di http://localhost:8000',
      )
    }
    throw error
  }
}

/**
 * Get santri detail by ID
 * @param {String} id - Santri ID (UUID)
 * @returns {Promise}
 */
export const getSantriDetail = async (id) => {
  const url = `${API_ENDPOINT}/santri-pribadi/${id}`

  console.group('🔍 API Call: Get Santri Detail')
  console.log('📤 Request URL:', url)
  console.log('📤 Santri ID:', id)

  try {
    const response = await fetch(url)
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', errorData)
      console.groupEnd()
      throw new Error('Failed to fetch santri detail')
    }

    const data = await response.json()
    console.log('✅ Response Data:', data)
    console.groupEnd()
    return data
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    throw error
  }
}

/**
 * Create new santri with photos
 * @param {Object} data - Santri data
 * @param {Array} files - Array of photo files
 * @returns {Promise}
 */
export const createSantri = async (data, files = []) => {
  const formData = new FormData()

  // Add all santri data fields
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      formData.append(key, data[key])
    }
  })

  // Add photo files
  files.forEach((file) => {
    formData.append('foto_files', file)
  })

  const url = `${API_ENDPOINT}/santri-pribadi`

  console.group('➕ API Call: Create Santri')
  console.log('📤 Request URL:', url)
  console.log('📤 Form Data:', data)
  console.log(
    '📤 Files:',
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  )

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', error)
      console.groupEnd()
      throw new Error(error.message || 'Failed to create santri')
    }

    const responseData = await response.json()
    console.log('✅ Response Data:', responseData)
    console.groupEnd()
    return responseData
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    throw error
  }
}

/**
 * Update santri data
 * @param {String} id - Santri ID
 * @param {Object} data - Updated santri data
 * @param {Array} files - New photo files (optional)
 * @returns {Promise}
 */
export const updateSantri = async (id, data, files = []) => {
  const formData = new FormData()

  // Add all updated fields
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      formData.append(key, data[key])
    }
  })

  // Add new photo files if any
  files.forEach((file) => {
    formData.append('foto_files', file)
  })

  const url = `${API_ENDPOINT}/santri-pribadi/${id}`

  console.group('✏️ API Call: Update Santri')
  console.log('📤 Request URL:', url)
  console.log('📤 Santri ID:', id)
  console.log('📤 Update Data:', data)
  console.log(
    '📤 New Files:',
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  )

  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: formData,
    })
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', error)
      console.groupEnd()
      throw new Error(error.message || 'Failed to update santri')
    }

    const responseData = await response.json()
    console.log('✅ Response Data:', responseData)
    console.groupEnd()
    return responseData
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    throw error
  }
}

/**
 * Delete santri
 * @param {String} id - Santri ID
 * @returns {Promise}
 */
export const deleteSantri = async (id) => {
  const url = `${API_ENDPOINT}/santri-pribadi/${id}`

  console.group('🗑️ API Call: Delete Santri')
  console.log('📤 Request URL:', url)
  console.log('📤 Santri ID:', id)

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', errorData)
      console.groupEnd()
      throw new Error('Failed to delete santri')
    }

    const data = await response.json()
    console.log('✅ Response Data:', data)
    console.groupEnd()
    return data
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    throw error
  }
}

/**
 * Add photos to existing santri
 * @param {String} id - Santri ID
 * @param {Array} files - Photo files
 * @returns {Promise}
 */
export const addSantriPhotos = async (id, files) => {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('foto_files', file)
  })

  const url = `${API_ENDPOINT}/santri-pribadi/${id}/photos`

  console.group('📸 API Call: Add Photos')
  console.log('📤 Request URL:', url)
  console.log('📤 Santri ID:', id)
  console.log(
    '📤 Files:',
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  )

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', errorData)
      console.groupEnd()
      throw new Error('Failed to add photos')
    }

    const data = await response.json()
    console.log('✅ Response Data:', data)
    console.groupEnd()
    return data
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    throw error
  }
}

/**
 * Delete a photo
 * @param {String} fotoId - Photo ID
 * @returns {Promise}
 */
export const deleteSantriPhoto = async (fotoId) => {
  const url = `${API_ENDPOINT}/santri-pribadi/photos/${fotoId}`

  console.group('🗑️ API Call: Delete Photo')
  console.log('📤 Request URL:', url)
  console.log('📤 Photo ID:', fotoId)

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error Response:', errorData)
      console.groupEnd()
      throw new Error('Failed to delete photo')
    }

    const data = await response.json()
    console.log('✅ Response Data:', data)
    console.groupEnd()
    return data
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.groupEnd()
    throw error
  }
}
